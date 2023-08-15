import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import SwiperCore, { Grid, Navigation, Pagination } from "swiper";
import { jobPostModel, filterConditions, jobPostPayload, _geoloc } from '../../model/typescriptModel/jobPost.model';
import { JobPostService } from '../../service/job-post.service';
import { paginateJobCategory, retrievedJobCategorySuccess } from '../../state/actions/job-post.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { toggleAddressChange } from 'src/app/state/actions/address.action';
import _ from 'lodash';
declare let window: any;
SwiperCore.use([Grid, Pagination, Navigation]);

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent implements OnDestroy{
  loadingFlag:boolean = true;
  CategorySymbol!: string;
  header!: string;
  urgentFilterForm!: FormGroup;
  query: string = ''
  infiniteScrollingLoadingFlag: boolean = false;
  paginationIndex: number = 0;
  nearMapFlag: boolean = false
  maxIndex: number = 0
  count!: number; 
  geoLocFlag!: boolean;
  brandToCategory!: string;
  emptyResultFlag: boolean = false;
  dateOfJob!: any
  searchModal: any
  indexName: string = 'pharm-work_index_dateUpdated_desc'
  _geoLoc!: _geoloc
  subscription: Subscription = new Subscription();
  content$!: Observable<jobPostModel[] | undefined>;
  count$!: Observable<number>;
  loading$!: Observable<boolean>;
  mrtStations$!: Observable<string[]>
  btsStations$!: Observable<string[]>
  province$!: Observable<string[]>;
  district$!: Observable<string[]>;
  section$!: Observable<string[]>;
  
  constructor(private route: ActivatedRoute, private router:Router,private store: Store, private jobPostService:JobPostService, private fb: FormBuilder){}
  
  ngOnInit(){
    this.searchModal = new window.bootstrap.Modal(
      document.getElementById('searchModal')
      );
    this.CategorySymbol = this.route.snapshot.queryParamMap.get('CategorySymbol')!;
    this.count$ = this.store.select((state: any) =>{
      const jobList : filterConditions =  state.jobpost.JobPost.find((res: any)=>{
        return res.CategorySymbol == this.CategorySymbol
      });
      return jobList.count
    })
    this.content$ = this.store.select((state: any) =>{
      const jobList : filterConditions =  state.jobpost.JobPost.find((res: any)=>{
        return res.CategorySymbol == this.CategorySymbol
      });
      this.header = jobList.header;
      this.brandToCategory = (jobList.brandToCategory !== undefined)? jobList.brandToCategory : '';
      this.count = jobList.count
      return jobList.allContent  
    })
    this.store.select((state: any)=>{
      return state.user
    }).subscribe((user: any)=>{
      if(user._geoloc == undefined){
        if(user._geolocCurrent == undefined){
          this._geoLoc = {
            lat: 0,
            lng: 0
          }
        }else{
          this._geoLoc = user._geolocCurrent
        }
      }else{
        this._geoLoc = user._geoloc
      }
      this.geoLocFlag = user._geoloc == undefined
    })
    this.btsStations$ = this.store.select((state: any)=>{
      return state.address.bts
    })
    this.mrtStations$ = this.store.select((state: any)=>{
      return state.address.mrt
    })
    this.initializeSelector();
    this.reset();
    this.subscription.add(this.content$.subscribe((content) =>{
      this.emptyResultFlag = (content!.length == 0)? true: false
    }))
    this.scrollUp()
  }

  onChangeEvent(event: any){
    if(event.target.checked && this.geoLocFlag){
      document.getElementById('flexSwitchCheckDefault')?.click()
      this.searchModal.hide()
      this.router.navigate(['pharma/profile-pharma'], {
        queryParams:{
          googleMapPointer:true
        }
      })
    }
  }

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }

  onScroll() {
    if(this.paginationIndex < this.maxIndex){
      this.infiniteScrollingLoadingFlag = true
      this.jobPostService.paginateJobCategoryResultsService(this.urgentFilterForm, this.CategorySymbol, this.paginationIndex, this.query, this.indexName, this.nearMapFlag).then((job)=>{
        this.paginationIndex++
        this.maxIndex = job.nbPages
        const payload: jobPostPayload = {
          CategorySymbol: this.CategorySymbol,
          JobsPost: job.hits.map((hit: any)=>{
            const newHit = _.cloneDeep(hit)
            newHit.custom_doc_id = hit.objectID
            delete newHit.objectID
            return newHit
          }),
          count: 0
        }
        this.store.dispatch(paginateJobCategory({jobs:payload}))
        this.infiniteScrollingLoadingFlag = false;
      })
    }
  }

  searchJobs(){
    this.loadingFlag = true;
    this.paginationIndex = 0
    if(this.urgentFilterForm.value.DateOfJob !== '' && this.urgentFilterForm.value.DateOfJob !== undefined){
      if(this.urgentFilterForm.value.DateOfJob.indexOf(', ') == -1){
        this.urgentFilterForm.patchValue({DateOfJob: [this.urgentFilterForm.value.DateOfJob]})
      }else{
        this.urgentFilterForm.value.DateOfJob = this.urgentFilterForm.value.DateOfJob.split(', ')
      }
    }
      if(this.urgentFilterForm.value.nearbyFlag && this.urgentFilterForm.value.radius == ''){
        this.nearMapFlag = true
        this.urgentFilterForm.patchValue({
          ...this.urgentFilterForm.value,
          Location: {
            Section: '',
            District: '',
            Province: ''
          }
      })
    }
    const finalForm = this.urgentFilterForm.value
    if(finalForm.Salary !== '' && finalForm.Salary !== undefined){
      finalForm.Salary = Number(finalForm.Salary)
    }
    if(this.urgentFilterForm.value.TimeFrame == 'Both'){
      finalForm.TimeFrame = ''
    }
    this.jobPostService.searchJobs(finalForm).then((jobs)=>{
      this.query = jobs.query
      this.paginationIndex = 1;
      this.maxIndex = jobs.result.nbPages
      this.indexName = jobs.indexName
      const newSrc = jobs.result.hits.map((hit: any)=>{
        const newHit = _.cloneDeep(hit);
        newHit.custom_doc_id = newHit.objectID
        delete newHit.objectID
        return newHit
      })
      const res: jobPostPayload = {
        JobsPost: newSrc,
        CategorySymbol: this.CategorySymbol,
        count: newSrc.length
      }
      this.store.dispatch(retrievedJobCategorySuccess({jobs:res}));
      this.loadingFlag = false
    })
  }

  initializeSelector(){
    this.province$ = this.store.select((state: any)=>{
      const result = Object.keys(state.address.list);
      return result
    })
    this.district$ = this.store.select((state: any)=>{
      if(this.urgentFilterForm.value.Location.Province === ''){
        return [];
      }
      return Object.keys(state.address.list[this.urgentFilterForm.value.Location.Province])
    })
    this.section$ = this.store.select((state: any)=>{
      if(this.urgentFilterForm.value.Location.District === ''){
        return [];
      }
      const section: string[] = state.address.list[this.urgentFilterForm.value.Location.Province][this.urgentFilterForm.value.Location.District].map((section: any)=>section.section);
      return section
    })
  }

  provinceSelected($event:any){
    this.urgentFilterForm.patchValue({
        ...this.urgentFilterForm.value,
        Location: {
          District:'', 
          Section:''
        }
    })
    this.store.dispatch(toggleAddressChange())
  }
  districtSelected($event:any){
    this.urgentFilterForm.patchValue({
        ...this.urgentFilterForm.value,
        Location: {
          Section:''
        }
    })
    this.store.dispatch(toggleAddressChange())
  }
  sectionSelected($event:any){
    this.store.dispatch(toggleAddressChange())
  }

  handleCalendarChange(value: any){
    this.urgentFilterForm.patchValue({
      DateOfJob: value.target.value.split(', ')
    })
  }
  initializeFormGroup(){
    if(this.CategorySymbol == 'AA'){
      this.urgentFilterForm = this.fb.group({
        nearbyFlag: false,
        _geoloc: this._geoLoc,
        radius: [500],
        DateOfJob: [''],
        Location: this.fb.group({
          Section: [''],
          District: [''],
          Province: [''],
        }),
        MRT: [''],
        BTS: [''],
        CategorySymbol: this.CategorySymbol
      })
      this.nearMapFlag = false
    }else{
      this.urgentFilterForm = this.fb.group({
        TimeFrame: [''],
        Salary: [''],
        OnlineInterview: false,
        Location: this.fb.group({
          Section: [''],
          District: [''],
          Province: [''],
        }),
        MRT: [''],
        BTS: [''],
        CategorySymbol: this.CategorySymbol
      })
      
    }
  }
  resetLight(){
    this.initializeFormGroup()
    this.initializeSelector()
    this.store.dispatch(toggleAddressChange())
  }
  reset(){
    this.initializeFormGroup();
    this.paginationIndex = 0
    this.indexName = 'pharm-work_index_dateUpdated_desc'
    this.jobPostService.getJobCategoryService(this.CategorySymbol, this.paginationIndex).then((jobPosts)=>{
      this.paginationIndex++;
      this.maxIndex = jobPosts.nbPages
      this.query = "Active:true AND CategorySymbol:" + this.CategorySymbol
      const newSrc = jobPosts.hits.map((hit: any)=>{
        const newHit = _.cloneDeep(hit);
        newHit.custom_doc_id = newHit.objectID
        delete newHit.objectID
        return newHit
      })
      const res: jobPostPayload = {
        JobsPost: newSrc,
        CategorySymbol: this.CategorySymbol,
        count: newSrc.length
      }
      this.store.dispatch(retrievedJobCategorySuccess({jobs:res}));
      this.loadingFlag = false
    })
    this.store.dispatch(toggleAddressChange())
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
