import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { User } from 'src/app/pharmacist/model/typescriptModel/users.model';
import { UserServiceService } from 'src/app/pharmacist/service/user-service.service';
import { UtilService } from 'src/app/pharmacist/service/util.service';
import { setCurrentUser } from 'src/app/state/actions/users.action';
import { PharmaProfileComponent } from '../pharma-profile.component';

@Component({
  selector: 'app-private-profile',
  templateUrl: './private-profile.component.html',
  styleUrls: ['./private-profile.component.css']
})
export class PrivateProfileComponent {
  innerProfileInformation!: User
  editFlag:boolean = false
  loadingFlag: boolean = false
  profileEdit!:FormGroup
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

  constructor(private route: ActivatedRoute,private store: Store, private fb: FormBuilder, private utilService:UtilService, private userService: UserServiceService, private pharmaProfile:PharmaProfileComponent){
  }
  ngOnInit(){
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
        this.resetFormGroup();
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.route.snapshot.queryParamMap.get('googleMapPointer')! !== undefined && this.route.snapshot.queryParamMap.get('googleMapPointer')! !== null){
      setTimeout(()=>{
        document.getElementById('googleMapScroll')?.scrollIntoView()
        setTimeout(()=>{
          this.pharmaProfile.openFormModal()
        }, 700)
      }, 700)
    }
  }

  cancelClick(){
    this.editFlag = false
    this.resetFormGroup();
  }

  editClick(){
    this.editFlag = !this.editFlag
    if(this.editFlag == false){
      this.resetFormGroup();
    }
  }

  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      gender: [''],
      Location: this.fb.group({
        address: [''],
        Province: [''],
        District: [''],
        Section: [''],
      }),
      contacts: this.fb.group({
        phone: [''],
        email: [''],
        line: [''],
        facebook: [''],
      }),
      license: [''],
      _geoloc: [''],
      active: ['true'],
      showProfileFlag: true,
    });
  }

  resetFormGroup(){
    this.initializeFormGroup();
    this.profileEdit.patchValue({
      ...this.innerProfileInformation,
    })
  }
  
  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  moveMap(event: any){
    this.markerPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    this.center = this.markerPosition
    this.profileEdit.patchValue({_geoloc: this.markerPosition})
  }
  searchMap(event: any){
    this.markerPosition = {
      lat: event.geometry.location.lat(),
      lng: event.geometry.location.lng()
    }
    this.center = this.markerPosition
    this.profileEdit.patchValue({_geoloc: this.markerPosition})
  }

  onSave(){
    const payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000)
    }
    if(payload._geoloc == ''){
      delete payload._geoloc
    }
    this.loadingFlag = true
    this.userService.updateUser(payload).then(()=>{
      this.loadingFlag = false
      this.store.dispatch(setCurrentUser({user: payload}))
      this.editClick()
    })
  }
}
