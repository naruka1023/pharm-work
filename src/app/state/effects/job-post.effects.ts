import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import { filterJobs, getJobProfile, getJobs, retrievedJobSuccess,  } from '../actions/job-post.actions';
import { JobPostService } from 'src/app/service/job-post.service';

@Injectable()
export class JobPostEffects {
  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getJobs),
      mergeMap(() => 
      this.jobPostService.getAllJobPost()
      .pipe(
        map(jobPosts => (
          retrievedJobSuccess({jobs:jobPosts})),
        catchError(() => EMPTY)
        ))
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