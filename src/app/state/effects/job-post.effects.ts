import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, concatMap, map, mergeMap, switchMap, take} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import { filterJobs, getJobCategory, getJobs, retrievedJobCategorySuccess, retrievedJobSuccess,  } from '../actions/job-post.actions';
import { JobPostService } from 'src/app/service/job-post.service';

@Injectable()
export class JobPostEffects {
  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getJobs),
      mergeMap(() => 
      this.jobPostService.getAllJobPost()
      .pipe(
        take(1),
        map((jobPosts) => (
          retrievedJobSuccess({jobs:jobPosts})),
        catchError(() => EMPTY)
        ))
      )
    )
  );
  loadJobsCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getJobCategory),
      switchMap((action) => 
      this.jobPostService.getJobCategoryService(action.CategorySymbol)
      .pipe(
        take(1),
        map(jobPosts => (
          retrievedJobCategorySuccess({jobs:jobPosts})),
        catchError((err) => {
          return err
        })
        )),
      )
    )
  );
  // loadJobProfile$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(getJobProfile),
  //     map(() =>{
  //       console.log('loadJobProfile')
  //       return retrievedJobSuccess({jobs:'asdrf'});
  //     })
  //   )
  // );
  // filterJob$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(filterJobs),
  //     map(() =>{
  //       console.log('filterJobs')
  //       return retrievedJobSuccess({jobs:'asdrf'});
  //     })
  //   )
  // );
  constructor(
    private actions$: Actions,
    private jobPostService: JobPostService
  ) {}
}