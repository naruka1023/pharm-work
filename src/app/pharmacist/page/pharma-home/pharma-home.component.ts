import { Component } from '@angular/core';
import SwiperCore, { Autoplay, Mousewheel, Navigation, Pagination } from "swiper";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { filterConditions, jobPostModel, jobPostPayload, userOperator } from '../../model/typescriptModel/jobPost.model';
import { retrievedJobSuccess } from '../../state/actions/job-post.actions';
import { JobPostService } from '../../service/job-post.service';
import headerArray from '../../model/data/uiKeys';
import _ from 'lodash';
// import { selectJobPost, selectLoading } from 'src/app/state/selectors/job-post.selectors';

SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel]);

@Component({
  selector: 'app-pharma-home',
  templateUrl: './pharma-home.component.html',
  styleUrls: ['./pharma-home.component.css']
})
export class PharmaHomeComponent {

  loadingFlag$!: Observable<boolean>;
  localItem: filterConditions[] = []
  content$!: Observable<filterConditions[]>; 
  items$!: Observable<filterConditions[]>;
    breakingPointOperator = {
    1400: {
      slidesPerView: 1.5,
    },
    1200: {
      slidesPerView: 2,
    },
    966: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 1.5,
    },
  }
  constructor(private jobPostService:JobPostService, private store: Store){
  }
  
  ngOnInit(){
  
    this.loadingFlag$ = this.store.select((state: any)=>
    state.jobpost.loading);
    this.loadingFlag$.subscribe((flag)=>{
      if(flag){
        this.dispatchJobs();
      }
    })

    this.items$ = this.store.select((state: any)=>{
        return state.jobpost.JobPost
    });
    this.items$.subscribe((item)=>{
      this.localItem = item;
    })
    this.scrollUp()
  }
  dispatchJobs() {
    let categorySymbols = headerArray.map((header:filterConditions)=> header.CategorySymbol)
    let promises: Promise<any>[] = []
    let countPromises: Promise<{
      categorySymbol: string;
      count: number;
    }>[] = []
    categorySymbols.forEach((categorySymbol: string)=>{
      countPromises.push(this.jobPostService.getCategorySymbolCount(categorySymbol))
    })
    Promise.all(countPromises).then((countPayload)=>{
      let newCountPayload: {
        [key: string]: number
      } = {}
      countPayload.forEach((cP)=>{
        newCountPayload[cP.categorySymbol] = cP.count
      })
      categorySymbols.forEach((categorySymbol:string)=>{
        switch(categorySymbol){
          case 'BA':
            promises.push(
              this.jobPostService.getOperatorsByType('ร้านยาแบรนด์').then((operators)=>{
                let res: jobPostPayload = {
                  UserOperator: operators,
                  CategorySymbol: categorySymbol,
                }
                return res
              })
            )
            break;
          case 'CB':
            promises.push(
              this.jobPostService.getOperatorsByType('บริษัท | โรงงาน').then((operators)=>{
                let res: jobPostPayload = {
                  UserOperator: operators,
                  CategorySymbol: categorySymbol,
                }
                return res
              })
            )
            break;
          default:
            promises.push(
              this.jobPostService.getJobCategoryServiceSmall(categorySymbol).then((jobPosts)=>{
                let res: jobPostPayload = {
                  JobsPost: jobPosts,
                  CategorySymbol: categorySymbol,
                  count: newCountPayload[categorySymbol]
                }
                return res
              })
            )
            break;
        }
      })
      Promise.all(promises).then((jobs: jobPostPayload[])=>{
        let newJobs: {
          [key:string]: jobPostPayload,
        } = {}
        jobs.forEach((job: jobPostPayload)=>{
          newJobs[job.CategorySymbol] = job
        })
        let finalPayload: filterConditions[] = headerArray.map((header:filterConditions)=>{
          return {
            ...header,
            content: newJobs[header.CategorySymbol].CategorySymbol == 'BA' ||
                     newJobs[header.CategorySymbol].CategorySymbol == 'CB' ? 
                     newJobs[header.CategorySymbol].UserOperator : newJobs[header.CategorySymbol].JobsPost,
            loading:false,
            count:newJobs[header.CategorySymbol].count!
          }
        }) 
        this.store.dispatch(retrievedJobSuccess({jobs: finalPayload}))
      })
    })
  }

  scrollUp(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior:"auto"
    });
  }
}
