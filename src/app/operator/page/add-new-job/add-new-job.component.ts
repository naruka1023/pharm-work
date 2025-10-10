import { NgZone, Component, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, first } from 'rxjs';
import { Contacts, User } from '../../model/user.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Instance } from 'flatpickr/dist/types/instance';
import { JobService } from '../../service/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { jobPostModel } from '../../model/jobPost.model';
import { toggleAddressChange } from '../../state/actions/address.actions';
import Validation from 'src/app/utils/validation';
import moment from 'moment';
import { UtilService } from '../../service/util.service';
import { LandingPageComponent } from '../../landing-page.component';
import { UsersService } from '../../service/users.service';
declare var window: any;

@Component({
  selector: 'app-add-new-job',
  templateUrl: './add-new-job.component.html',
  styleUrls: ['./add-new-job.component.css'],
})
export class AddNewJobComponent {
  constructor(
    private store: Store,
    private router: Router,
    private utilService: UtilService,
    private fb: FormBuilder,
    private newJobService: JobService,
    private route: ActivatedRoute,
    private landingPage: LandingPageComponent
  ) {}

  @ViewChild('searchInput', { static: false })
  searchInput!: ElementRef<HTMLInputElement>;
  currentDate: Date = new Date();
  maxDate: Date = new Date();
  user$!: Observable<User>;
  userState!: User;
  timeFrame!: string;
  newJobForm!: FormGroup;
  customSuffix: string = '';
  urgency!: any;
  sub!: Promise<any>;
  submitted: boolean = false;
  locationSubmitted: boolean = false;
  disabledFlag: boolean = true;
  nearBTSFlag: boolean = false;
  nearARLFlag: boolean = false;
  nearMRTFlag: boolean = false;
  nearSRTFlag: boolean = false;
  phone$!: Observable<string>;
  email$!: Observable<string>;
  line$!: Observable<string>;
  facebook$!: Observable<string>;
  salaryRadioFlag: boolean = false;
  flag!: Instance[] | Instance;
  arlStations$!: Observable<string[]>;
  srtStations$!: Observable<string[]>;
  btsStations$!: Observable<string[]>;
  mrtStations$!: Observable<string[]>;
  display: any;
  zoom: number = 15;
  emptyJobPostModel: Partial<jobPostModel> = {
    Amount: 2,
    CategorySymbol: 'fdsasd',
    BTS: {
      Near: false,
      Station: 'fdsasd',
    },
    Establishment: 'fdsasd',
    Franchise: 'fdsasd',
    Address: '',
    JobName: 'fdsasd',
    JobType: 'fdsasd',
    MRT: {
      Near: false,
      Station: '',
    },
    SRT: {
      Near: false,
      Station: '',
    },
    ARL: {
      Near: false,
      Station: '',
    },
    OnlineInterview: false,
    WorkFromHome: false,
    Salary: {
      Amount: 30,
      Cap: 50,
      Suffix: 'fdsasd',
    },
    Contacts: {
      nameRepresentative: 'fdsasd',
      areaOfContact: 'fdsasd',
      phone: '0818083007',
      email: 'p.mua@gmail.com',
      line: '',
      website: '',
      facebook: '',
    },
    JobDetails: 'fdsasd',
    TravelInstructions: 'fdsasd',
    qualityApplicants: 'fdsasd',
    jobBenefits: 'fdsasd',
    applyInstructions: 'fdsasd',
    OperatorUID: '',
    _geoloc: {
      lat: 500,
      lng: 500,
    },
    TimeFrame: 'Part-Time',
    Urgency: false,
    Active: false,
    DateOfJob: '',
    dateCreated: '',
    dateUpdated: '',
    dateUpdatedUnix: 0,
    custom_doc_id: '',
  };
  none: google.maps.MapOptions = {
    gestureHandling: 'greedy',
  };
  center: any = 'undefined';
  markerPosition: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  jobDetailsEditor = ClassicEditor;
  loadingFlag: boolean = false;
  jobDetailsModel = {
    editorData: '',
  };
  travelEditor = ClassicEditor;
  travelModel = {
    editorData: '',
  };
  jobBenefitsEditor = ClassicEditor;
  jobBenefitsModel = {
    editorData: '',
  };
  applyInstructionsEditor = ClassicEditor;
  applyInstructionsModel = {
    editorData: '',
  };
  qualityEditor = ClassicEditor;
  qualityModel = {
    editorData: '',
  };
  ngAfterViewInit(): void {
    this.utilService.initAutocomplete(this.searchInput.nativeElement);
  }
  ngOnInit() {
    this.utilService.placeSelected$.subscribe((place) => {
      const location = place.geometry?.location;
      if (location) {
        this.markerPosition = { lat: location.lat(), lng: location.lng() };
        this.center = { ...this.markerPosition };
      }
      this.newJobForm.patchValue({ _geoloc: this.markerPosition });
    });
    this.urgency = this.route.snapshot.queryParamMap.get('urgency')!;

    this.maxDate.setDate(this.maxDate.getDate() + 29);
    this.urgency = this.urgency == 'false' ? false : true;

    this.srtStations$ = this.store.select((state: any) => {
      return state.address.srt;
    });
    this.arlStations$ = this.store.select((state: any) => {
      return state.address.arl;
    });
    this.btsStations$ = this.store.select((state: any) => {
      return state.address.bts;
    });
    this.mrtStations$ = this.store.select((state: any) => {
      return state.address.mrt;
    });
    this.user$ = this.store.select((state: any) => {
      return state.user;
    });
    this.user$.subscribe((user: User) => {
      this.userState = user;
      this.userState = _.cloneDeep(user);
      if (this.userState._geoloc !== undefined) {
        this.center = this.userState._geoloc;
      } else {
        if (this.userState._geolocCurrent == undefined) {
          this.center = {
            lat: 0,
            lng: 0,
          };
        } else {
          this.center = this.userState._geolocCurrent!;
        }
      }
      this.markerPosition = this.center;
      this.initializeFormGroup();
    });
    this.initializeFormGroup();

    this.newJobForm.valueChanges.subscribe((form: any) => {
      if (!this.urgency) {
        this.timeFrame = form.TimeFrame;
      }
    });

    this.scrollUp();
    this.utilService
      .getConfirmAddJobSubject()
      .pipe(first())
      .subscribe((activeFlag) => {
        this.onSave(activeFlag);
      });
  }

  onConfirmModalOpen() {
    this.landingPage.openAddJobConfirmModal();
  }

  cancelClick() {
    this.router.navigate(['operator']);
  }

  salaryRadioChange(event: any) {
    if (event.target.value !== 'SalaryNumbers') {
      this.newJobForm.get('Salary.salaryEnd')!.disable();
      this.newJobForm.get('Salary.salaryEnd')?.patchValue('');
      this.newJobForm.get('Salary.salaryStart')!.disable();
      this.newJobForm.get('Salary.salaryStart')?.patchValue('');
    } else {
      this.newJobForm.get('Salary.salaryEnd')!.enable();
      this.newJobForm.get('Salary.salaryStart')!.enable();
      this.newJobForm.get('Salary.salaryEnd')!.enable();
    }
  }
  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }

  handleCalendarChange(value: any) {
    this.newJobForm.patchValue({
      DateOfJob: value.selectedDates,
    });
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  moveMap(event: any) {
    this.markerPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    this.center = this.markerPosition;
    this.utilService
      .getMapAddress(
        this.markerPosition.lng.toString(),
        this.markerPosition.lat.toString()
      )
      .subscribe((result: any) => {
        this.newJobForm.patchValue({
          Address: result.results[0].formatted_address,
        });
      });
    this.newJobForm.patchValue({ _geoloc: this.markerPosition });
  }

  mapJobTypeToCategorySymbol() {
    let categorySymbol = '';
    if (this.urgency) {
      categorySymbol = 'AA';
    } else {
      switch (this.userState.jobType) {
        case 'ร้านยาทั่วไป':
          categorySymbol = 'AB';
          break;
        case 'ร้านยาแบรนด์':
          categorySymbol = 'AC';
          break;
        case 'โรงพยาบาล':
          categorySymbol = 'BB';
          break;
        case 'คลินิก':
          categorySymbol = 'BB';
          break;
        case 'โรงงาน':
          categorySymbol = 'BC';
          break;
        case 'บริษัท':
          categorySymbol = 'BC';
          break;
        case 'วิจัย':
          categorySymbol = 'BC';
          break;
        case 'อื่นๆ':
          categorySymbol = 'CA';
          break;
      }
    }
    return categorySymbol;
  }

  get getNewJobForm(): { [key: string]: AbstractControl } {
    return this.newJobForm.controls;
  }

  styleSelect(id: string) {
    document.getElementById(id)!.style.color = 'black';
  }

  initializeFormGroup() {
    this.newJobForm = this.fb.group({
      firstNotificationFlag: true,
      JobType: this.userState.jobType,
      Establishment: this.userState.companyName,
      CategorySymbol: this.mapJobTypeToCategorySymbol(),
      dateCreated: [''],
      dateUpdated: [''],
      Address: [''],
      dateUpdatedUnix: [''],
      TimeFrame: [this.urgency ? 'Part-Time' : '', [Validators.required]],
      OperatorUID: [this.userState.uid],
      JobName: ['', [Validators.required]],
      Amount: ['', [Validators.required]],
      _geoloc: [this.center, [Validators.required]],
      Active: [true],
      Duration: [''],
      timeStart: this.urgency ? ['', [Validators.required]] : [''],
      timeEnd: this.urgency ? ['', [Validators.required]] : [''],
      Urgency: [this.urgency],
      Salary: this.fb.group({
        Amount: [''],
        Cap: [''],
        Suffix: 'SalaryNumbers',
        salaryStart: ['', [Validators.required]],
        salaryEnd: [''],
      }),
      OnlineInterview: [false],
      WorkFromHome: [false],
      Location: this.fb.group({
        Section: ['', [Validators.required]],
        District: ['', [Validators.required]],
        Province: ['', [Validators.required]],
      }),
      Contacts: this.fb.group({
        nameRepresentative: ['', [Validators.required]],
        areaOfContact: [this.userState.contacts?.areaOfContact],
        phone: [this.userState.contacts?.phone, [Validators.required]],
        email: [this.userState.contacts?.email, [Validators.required]],
        website: [this.userState.contacts?.website],
        line: this.userState.contacts?.line,
        facebook: this.userState.contacts?.facebook,
      }),
      MRT: this.fb.group({
        Near: [''],
        Station: [''],
      }),
      BTS: this.fb.group({
        Near: [''],
        Station: [''],
      }),
      SRT: this.fb.group({
        Near: [''],
        Station: [''],
      }),
      ARL: this.fb.group({
        Near: [''],
        Station: [''],
      }),
      JobDetails: ['', [Validators.required]],
      TravelInstructions: ['', [Validators.required]],
      profilePictureUrl:
        this.userState.cropProfilePictureUrl !== undefined &&
        this.userState.cropProfilePictureUrl !== ''
          ? this.userState.cropProfilePictureUrl
          : this.userState.profilePictureUrl,
      coverPhotoPictureUrl: this.userState.coverPhotoPictureUrl,
      coverPhotoOffset: this.userState.coverPhotoOffset,
    });
    if (this.userState.jobType === 'ร้านยาแบรนด์') {
      this.newJobForm.addControl('Franchise', this.fb.control(['']));
    }
    if (this.urgency) {
      this.timeFrame = 'Part-Time';
      this.newJobForm.patchValue({
        TimeFrame: 'Part-Time',
      });
      this.newJobForm.addControl(
        'DateOfJob',
        this.fb.control('', Validators.required)
      );
    } else {
      this.newJobForm.addControl(
        'jobBenefits',
        this.fb.control('', Validators.required)
      );
    }
    this.newJobForm.addControl(
      'qualityApplicants',
      this.fb.control('', Validators.required)
    );
    this.newJobForm.addControl(
      'applyInstructions',
      this.fb.control('', Validators.required)
    );
  }
  onSaveOpenModal() {
    this.submitted = true;
    this.locationSubmitted = true;
    if (this.newJobForm.invalid) {
      return;
    } else {
      this.onConfirmModalOpen();
    }
  }
  onSave(activeBoolean: boolean) {
    let processedInfo: any = {};
    processedInfo = {
      firstNotificationFlag: !activeBoolean,
      Salary: {
        Amount:
          this.newJobForm.value.Salary.salaryStart == undefined
            ? 0
            : Math.round(this.newJobForm.value.Salary.salaryStart),
        Suffix:
          this.newJobForm.value.Salary.Suffix == 'CustomSuffix'
            ? this.customSuffix
            : this.newJobForm.value.Salary.Suffix,
        Cap:
          this.newJobForm.value.Salary.salaryEnd !== undefined &&
          this.newJobForm.value.Salary.salaryEnd !== null &&
          this.newJobForm.value.Salary.salaryEnd !== '' &&
          this.newJobForm.value.Salary.salaryEnd !== 0
            ? Math.round(
                this.newJobForm.value.Salary.salaryEnd -
                  this.newJobForm.value.Salary.salaryStart
              )
            : 0,
      },
    };
    processedInfo = {
      ...processedInfo,
      Duration:
        this.newJobForm.value.timeStart + ' - ' + this.newJobForm.value.timeEnd,
    };
    processedInfo.Salary!.Amount = Math.round(processedInfo.Salary!.Amount);
    processedInfo.Salary!.Cap = Math.round(processedInfo.Salary!.Cap!);
    // this.newJobForm.removeControl('timeStart')
    // this.newJobForm.removeControl('timeEnd')
    processedInfo = {
      ...processedInfo,
      Urgency: this.urgency,
      MRT: {
        Near: this.nearMRTFlag,
      },
      BTS: {
        Near: this.nearBTSFlag,
      },
      SRT: {
        Near: this.nearSRTFlag,
      },
      ARL: {
        Near: this.nearARLFlag,
      },
      Active: activeBoolean,
      dateCreated: new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
      dateUpdatedUnix: Math.floor(new Date().getTime() / 1000),
    };
    this.newJobForm.patchValue(processedInfo);
    let postJobForm = this.newJobForm.value;

    delete postJobForm.timeStart;
    delete postJobForm.timeEnd;

    delete postJobForm.Salary.salaryStart;
    delete postJobForm.Salary.salaryEnd;

    this.loadingFlag = true;
    let notificationPayload = {};
    if (this.urgency) {
      if (!activeBoolean) {
        notificationPayload = {
          title:
            'สร้างประกาศงานรายวัน "' +
            this.newJobForm.value.JobName +
            '" สำเร็จ',
          body: 'พร้อมปิดประกาศงานไว้ก่อน ผู้สมัครจะไม่สามารถค้นพบประกาศงานจนกว่าคุณจะทำการเปิดประกาศงาน',
          image:
            this.userState.cropProfilePictureUrl !== ''
              ? this.userState.cropProfilePictureUrl
              : this.userState.profilePictureUrl,
          url: '',
        };
      } else {
        notificationPayload = {
          title:
            'สร้างประกาศงานรายวัน "' +
            this.newJobForm.value.JobName +
            '" สำเร็จ',
          body: 'พร้อมเปิดประกาศงานให้ผู้สมัครสามารถค้นหาได',
          image:
            this.userState.cropProfilePictureUrl !== ''
              ? this.userState.cropProfilePictureUrl
              : this.userState.profilePictureUrl,
          url: '',
        };
      }
    } else {
      if (!activeBoolean) {
        notificationPayload = {
          title:
            'สร้างประกาศงานทั่วไป "' +
            this.newJobForm.value.JobName +
            '" สำเร็จ',
          body: 'พร้อมปิดประกาศงานไว้ก่อน ผู้สมัครจะไม่สามารถค้นพบประกาศงานจนกว่าคุณจะทำการเปิดประกาศงาน',
          image:
            this.userState.cropProfilePictureUrl !== ''
              ? this.userState.cropProfilePictureUrl
              : this.userState.profilePictureUrl,
          url: '',
        };
      } else {
        notificationPayload = {
          title:
            'สร้างประกาศงานทั่วไป "' +
            this.newJobForm.value.JobName +
            '" สำเร็จ',
          body: 'พร้อมเปิดประกาศงานให้ผู้สมัครสามารถค้นหาได้',
          image:
            this.userState.cropProfilePictureUrl !== ''
              ? this.userState.cropProfilePictureUrl
              : this.userState.profilePictureUrl,
          url: '',
        };
      }
    }
    if (this.urgency) {
      if (postJobForm.DateOfJob.length > 1) {
        this.sub = this.newJobService.addMultipleJobs(postJobForm);
      } else {
        if (this.newJobForm.value.DateOfJob.length !== 0) {
          const processedDate = moment(postJobForm.DateOfJob[0]).format(
            'yyyy-MM-DD'
          );
          postJobForm = {
            ...postJobForm,
            DateOfJob: processedDate,
          };
        }
        this.sub = this.newJobService.addOneJob(postJobForm);
      }
    } else {
      this.sub = this.newJobService.addOneJob(postJobForm);
    }
    this.sub.then((job) => {
      this.landingPage.appendAlertfromOutside(notificationPayload);
      this.loadingFlag = false;
      this.router.navigate(['operator/profile-operator/all-jobs-posts']);
    });
  }
}
