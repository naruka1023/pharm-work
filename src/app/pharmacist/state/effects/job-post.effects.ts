import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, concatMap, distinctUntilChanged, exhaustMap, map, mergeMap, switchMap, take} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import { getBookmarks, getJobCategory, getJobs, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess,  } from '../actions/job-post.actions';
import { JobPostService } from '../../service/job-post.service';

@Injectable()
export class JobPostEffects {
  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getJobs),
      switchMap(() => 
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

  loadBookmarks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBookmarks),
      switchMap((action) =>
        this.jobPostService.getUserBookmark(action.userUID)
        .pipe(
          take(1),
          switchMap((bookmark: any)=> {
            return this.jobPostService.getListofJobFromBookmark(bookmark).pipe(
              map((bookmark: any)=>(
                retrievedUserBookmarkSuccess({Bookmarks: bookmark})),
              )
            );
          })
        )
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
        map((jobPosts:any) => (
          retrievedJobCategorySuccess({jobs:jobPosts})),
        catchError((err) => {
          return err
        })
        )),
      )
    )
  );
  constructor(
    private actions$: Actions,
    private jobPostService: JobPostService
  ) {}
}