import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import _ from 'lodash';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { JobTypeConverterService } from 'src/app/service/job-type-converter.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare let window: any;

@Component({
  selector: 'app-urgent-jobs',
  templateUrl: './urgent-jobs.component.html',
  styleUrls: ['./urgent-jobs.component.css']
})
export class UrgentJobsComponent {
  innerProfileInformation!: User;
  
  urgentProfileEdit!:FormGroup
  loadingFlagUrgent: boolean = false;

  profileEdit!:FormGroup
  resultPayload:string[] = []
  descriptionEditor = ClassicEditor;
  loadingFlag: boolean = false;
  urgentJobFlag: boolean = false;
  editFlag:boolean = false

  confirmationModal!: any
  googleMapFlag!:boolean
  display: any;
  zoom = 15;
  none: google.maps.MapOptions = {
    gestureHandling:'greedy'
  };
  center: google.maps.LatLngLiteral = {
      lat: 0,
      lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  markerOptions: google.maps.MarkerOptions = {draggable: false};

  constructor(private store: Store,  private converter: JobTypeConverterService, private userService: UserServiceService, private fb: FormBuilder, private utilService:UtilService){}
  
  ngOnInit(){
    this.confirmationModal = new window.bootstrap.Modal(
      document.getElementById('confirmationModal')
    )
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: User)=>{
      
      this.innerProfileInformation = _.cloneDeep(value);
      if(this.innerProfileInformation._geoloc !== undefined){
        this.center = this.innerProfileInformation._geoloc
      }else{
        if(this.innerProfileInformation._geolocCurrent == undefined){
          this.center = {
            lat: 0,
            lng: 0
          }
        }else{
          this.center = this.innerProfileInformation._geolocCurrent!
        }
      }
      this.googleMapFlag = this.innerProfileInformation._geoloc !== undefined
      this.markerPosition = this.center
      if(this.innerProfileInformation.role !== ''){
        this.resultPayload = this.innerProfileInformation.urgentPreferredDay!;
        this.urgentJobFlag = this.converter.arrayToObject(this.innerProfileInformation.preferredJobType).S
        this.resetFormGroup();
        this.resetUrgentFormGroup();
      }
    })
    document.getElementById('confirmationModal')?.addEventListener('hide.bs.modal', ()=>{
      this.resetFormGroup()
    })
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  onSaveUrgent(){
    let payload = {
      ...this.urgentProfileEdit.value,
      uid: this.innerProfileInformation.uid,
      urgentPreferredDay: this.converter.objectToArrayUrgent(this.urgentProfileEdit.value.urgentPreferredDay),
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
    }
    if(payload._geoloc == ''){
      delete payload._geoloc
    }
    this.loadingFlagUrgent = true
    payload = this.utilService.populateObjectWithUrgentLocationFields(payload);
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlagUrgent = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.cancelClick();
      this.closeModal()
    }) 
  }
  onSave(){
    let payload: Partial<User>= {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      preferredJobType: this.converter.objectToArray(this.profileEdit.value.preferredJobType),
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
    }
    this.loadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.closeModal()
    })
  }
  resetUrgentFormGroup(){
    this.initializeUrgentFormGroup()
    this.urgentProfileEdit.patchValue({
      ...this.innerProfileInformation,
    })
    let resultObject = this.converter.arrayToObjectUrgent(this.innerProfileInformation.urgentPreferredDay)
    this.urgentProfileEdit.patchValue({
      ...this.innerProfileInformation,
      urgentPreferredDay:resultObject
    })
  }
  editClick(){
    this.editFlag = !this.editFlag
    if(this.editFlag == false){
      this.resetUrgentFormGroup();
    }
  }
  closeModal(){
    this.confirmationModal.hide()
  }
  openModal(){
    this.confirmationModal.show()
  }
  initializeUrgentFormGroup(){
    this.urgentProfileEdit = this.fb.group({
      urgentTimeFrame: [''],
      urgentPreferredDay: new FormGroup({
        M:  new FormControl(false),
        T:  new FormControl(false),
        W:  new FormControl(false),
        TH: new FormControl(false),
        F:  new FormControl(false),
        SA: new FormControl(false),
        SU: new FormControl(false),
        NA: new FormControl(false)
      }),
      urgentDescription: [''],
      _geoloc: [''],
      preferredUrgentLocation: this.fb.group({
        Section: [''],
        District: [''],
        Province: [''], 
      }),
    });
  }
  moveMap(event: any){
    this.markerPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    this.center = this.markerPosition
    this.urgentProfileEdit.patchValue({_geoloc: this.markerPosition})
  }
  searchMap(event: any){
    this.markerPosition = {
      lat: event.geometry.location.lat(),
      lng: event.geometry.location.lng()
    }
    this.center = this.markerPosition
    this.urgentProfileEdit.patchValue({_geoloc: this.markerPosition})
  }
  cancelClick(){
    this.editFlag = false
    this.resetUrgentFormGroup();
  }
  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      preferredJobType: new FormGroup({
        S: new FormControl(false),
        AA: new FormControl(false),
        AB: new FormControl(false),
        AC: new FormControl(false),
        BA: new FormControl(false),
        BB: new FormControl(false),
        BC: new FormControl(false),
        CA: new FormControl(false),
        CB: new FormControl(false),
      }),
    });
  }
  get (): { [key: string]: AbstractControl } { 
    return this.profileEdit.controls;
  } 
  resetFormGroup(){
    this.initializeFormGroup();
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
    })
    let resultObject = this.converter.arrayToObject(this.innerProfileInformation.preferredJobType)
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
      preferredJobType:resultObject
    })
    this.urgentJobFlag = resultObject.S
  }
}
