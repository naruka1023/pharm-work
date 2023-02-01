import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, concatMap, distinctUntilChanged, exhaustMap, map, mergeMap, switchMap, take} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import { filterJobs, getBookmarks, getJobCategory, getJobs, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess,  } from '../actions/job-post.actions';
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
    // this.actions$.pipe(
    //   ofType(getBookmarks),
    //   switchMap((action) => 
    //     this.jobPostService.getUserBookmark(action.userUID)
    //     .pipe(
    //       take(1),
    //       map(bookmarks =>{
    //         retrievedUserBookmarkSuccess({Bookmarks:bookmarks}),
    //       catchError((err) => {
    //         return err
    //       })
    //       })
    //     )
    //   )
    // )
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