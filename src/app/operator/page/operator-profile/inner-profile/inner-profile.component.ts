import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/operator/model/user.model';
import { UtilService } from 'src/app/operator/service/util.service';
import { setCurrentUser, toggleLoading } from 'src/app/state/actions/users.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-inner-profile',
  templateUrl: './inner-profile.component.html',
  styleUrls: ['./inner-profile.component.css']
})
export class InnerProfileComponent implements OnDestroy {

  loading$!: Observable<boolean>;
  profileEditState!: boolean;
  innerProfileInformation!: User;
  profileEdit!:FormGroup;
  modal!:any;
  zoom = 15;
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  }
  subject: Subscription = new Subscription();
  url: string = 'operator/profile-operator';
  productsAndServicesEditor = ClassicEditor;
  productsAndServicesModel = {
    editorData: ''
  };
  TravelInstructionsEditor = ClassicEditor;
  TravelInstructionsModel = {
    editorData: ''
  };
  benefitsEditor = ClassicEditor;
  benefitsModel = {
    editorData: ''
  }
  constructor(private utilService: UtilService, private store: Store, private fb: FormBuilder, private modalService: NgbModal, private route:Router){}

  ngOnInit(){
    this.profileEditState = false;
    this.loading$ = this.store.select((state:any)=>{
      return state.user.loading
    })
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((value: any)=>{
      if(!value.loading){
        this.innerProfileInformation = value;
        if(this.innerProfileInformation.role !== ''){
          this.resetFormGroup();
        }
        if(this.innerProfileInformation._geoloc !== undefined){
          this.center = this.innerProfileInformation._geoloc
        }else{
          this.center = this.innerProfileInformation._geolocCurrent!
        }
        this.markerPosition = this.center
      }
    })
    this.subject.add(this.utilService.getLeaveEditSubject().subscribe((src)=>{
      this.url = src;
    }));
  }
  toggleEdit(){
    this.profileEditState = !this.profileEditState;
  }

  move(event: google.maps.MapMouseEvent) {
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

  initializeFormGroup(){
    this.profileEdit = this.fb.group({
      companyName: [''],
      Location: this.fb.group({
        address: [''],
        Section: [''],
        District: [''],
        Province: [''],
      }),
      contacts: this.fb.group({
        phone: [''],
        email: [''],
        line: [''],
        website: [''],
        facebook: [''],
        twitter: [''],
        skype: [''],
        youtube: [''],
      }),
      companySize: [''],
      productsAndServices:[''],
      TravelInstructions:[''],
      companyID: [''],
      benefits: [''],
      nameOfPerson: [''],
      _geoloc: [''],
      phoneNumber: [''],
      emailRepresentative: [''],
      AmountCompleted: [''],
    });
  }
  resetFormGroup(){
    this.initializeFormGroup()
    this.profileEdit.patchValue(this.innerProfileInformation)
  }
  beginNavigation(){
    if(this.url.indexOf('?') === -1){
      this.route.navigate([this.url]);
    }else{
      const parsedUrl = this.url.split('?')[1].split('&');
      let queryParams: any = {
        queryParams:{}
      };
      parsedUrl.forEach((param)=>{
        const paramKeyValue = param.split('=');
        queryParams.queryParams[paramKeyValue[0]] = paramKeyValue[1];
      })
      this.url = '..'.concat(this.url.split('?')[0]);
      this.route.navigate([this.url], queryParams)
    }
  }
  onSave(){
    this.store.dispatch(toggleLoading())
    const payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      role: this.innerProfileInformation.role,
      email: this.innerProfileInformation.email
    }
    this.utilService.updateUser(payload).then(()=>{
      this.store.dispatch(setCurrentUser({user: payload}))
      this.beginNavigation()
      this.profileEditState = false;
    })
  }
  ngOnDestroy(){
    this.subject.unsubscribe();
  }
}
