import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/operator/model/user.model';
import { UtilService } from 'src/app/operator/service/util.service';
import {
  setCurrentUser,
  toggleLoading,
} from 'src/app/state/actions/users.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Auth, updateProfile } from '@angular/fire/auth';
import { OperatorProfileComponent } from '../operator-profile.component';
@Component({
  selector: 'app-inner-profile',
  templateUrl: './inner-profile.component.html',
  styleUrls: ['./inner-profile.component.css'],
})
export class InnerProfileComponent implements OnDestroy, AfterViewInit {
  loading$!: Observable<boolean>;
  profileEditState!: boolean;
  innerProfileInformation!: User;
  profileEdit!: FormGroup;
  googleMapFlag!: boolean;
  loadingFlag: boolean = false;
  modal!: any;
  none: google.maps.MapOptions = {
    gestureHandling: 'greedy',
  };
  zoom = 15;
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  firstEdit: boolean = true;
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  subject: Subscription = new Subscription();
  url: string = 'operator/profile-operator';
  productsAndServicesEditor = ClassicEditor;
  productsAndServicesModel = {
    editorData: '',
  };
  TravelInstructionsEditor = ClassicEditor;
  TravelInstructionsModel = {
    editorData: '',
  };
  benefitsEditor = ClassicEditor;
  benefitsModel = {
    editorData: '',
  };
  constructor(
    private profileOperator: OperatorProfileComponent,
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private store: Store,
    private fb: FormBuilder,
    private route: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  @ViewChild('searchInputInnerProfile', { static: false })
  searchInput!: ElementRef<HTMLInputElement>;
  private autocompleteInitialized = false;

  ngAfterViewInit() {
    this.activatedRoute.data.subscribe((url: any) => {
      if (url.scrollFlag == null && url.scrollFlag == undefined) {
        const gmp =
          this.activatedRoute.snapshot.queryParamMap.get('googleMapPointer')!;
        if (gmp !== undefined && gmp !== null) {
          setTimeout(() => {
            document.getElementById('googleMapScroll')?.scrollIntoView();
            setTimeout(() => {
              this.profileOperator.openFormModal();
            }, 1000);
          }, 700);
        }
      }
      this.profileEdit.patchValue({ _geoloc: this.markerPosition });
    });
  }
  ngOnInit() {
    this.utilService.placeSelected$.subscribe((place) => {
      const location = place.geometry?.location;
      if (location) {
        this.markerPosition = { lat: location.lat(), lng: location.lng() };
        this.center = { ...this.markerPosition };
      }
      this.profileEdit.patchValue({ _geoloc: this.markerPosition });
    });
    this.profileEditState = false;
    this.loading$ = this.store.select((state: any) => {
      return state.user.loading;
    });
    this.store
      .select((state: any) => {
        return state.user;
      })
      .subscribe((value: any) => {
        if (!value.loading) {
          this.innerProfileInformation = value;
          if (this.innerProfileInformation.role !== '') {
            this.resetFormGroup();
          }
          if (this.innerProfileInformation._geoloc !== undefined) {
            this.center = this.innerProfileInformation._geoloc;
          } else {
            if (this.innerProfileInformation._geolocCurrent == undefined) {
              this.center = {
                lat: 0,
                lng: 0,
              };
            } else {
              this.center = this.innerProfileInformation._geolocCurrent!;
            }
          }
          this.googleMapFlag =
            this.innerProfileInformation._geoloc !== undefined;
          this.markerPosition = this.center;
        }
      });
    this.subject.add(
      this.utilService.getLeaveEditSubject().subscribe((src) => {
        this.url = src;
      })
    );
  }

  toggleEdit() {
    this.profileEditState = !this.profileEditState;
    if (this.profileEditState) {
      this.autocompleteInitialized = false;
      this.cdRef.detectChanges();
    } else {
      this.utilService.destroyAutocomplete();
    }
  }
  ngAfterViewChecked(): void {
    if (
      this.profileEditState &&
      this.searchInput &&
      !this.autocompleteInitialized
    ) {
      this.utilService.initAutocomplete(this.searchInput.nativeElement);
      this.autocompleteInitialized = true;
    }
  }

  move(event: google.maps.MapMouseEvent) {}

  moveMap(event: any) {
    this.markerPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    this.center = this.markerPosition;
    this.profileEdit.patchValue({ _geoloc: this.markerPosition });
  }

  initializeFormGroup() {
    this.profileEdit = this.fb.group({
      companyName: [''],
      Location: this.fb.group({
        address: [''],
        Section: [''],
        District: [''],
        Province: [''],
      }),
      contacts: this.fb.group({
        areaOfContact: [''],
        nameRepresentative: [''],
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
      productsAndServices: [''],
      TravelInstructions: [''],
      companyID: [''],
      benefits: [''],
      nameOfPerson: [''],
      _geoloc: [''],
      phoneNumber: [''],
      emailRepresentative: [''],
      AmountCompleted: [''],
    });
  }
  // document.getElementById('googleMapScroll')!.scrollIntoView();
  resetFormGroup() {
    this.initializeFormGroup();
    this.profileEdit.patchValue(this.innerProfileInformation);
  }
  beginNavigation() {
    if (this.url.indexOf('?') === -1) {
      this.route.navigate([this.url]);
    } else {
      const parsedUrl = this.url.split('?')[1].split('&');
      const queryParams: any = {
        queryParams: {},
      };
      parsedUrl.forEach((param) => {
        const paramKeyValue = param.split('=');
        queryParams.queryParams[paramKeyValue[0]] = paramKeyValue[1];
      });
      this.url = '..'.concat(this.url.split('?')[0]);
      this.route.navigate([this.url], queryParams);
    }
  }

  onSave() {
    this.store.dispatch(toggleLoading());
    const payload = {
      ...this.profileEdit.value,
      uid: this.innerProfileInformation.uid,
      role: this.innerProfileInformation.role,
      email: this.innerProfileInformation.email,
    };
    if (payload._geoloc == '') {
      delete payload._geoloc;
    }
    this.utilService.updateUser(payload).then(() => {
      if (
        this.profileEdit.value.companyName !==
        this.innerProfileInformation.companyName
      ) {
        this.utilService.updateCompanyName(payload.uid!, payload.companyName!);
      }
      this.store.dispatch(setCurrentUser({ user: payload }));
      this.beginNavigation();
      this.profileEditState = false;
    });
  }
  cancelClick() {
    this.profileEditState = false;
    this.resetFormGroup();
  }
  ngOnDestroy() {
    this.subject.unsubscribe();
  }
}
