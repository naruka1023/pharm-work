import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import { getBookmarks, getJobCategory, retrievedJobCategorySuccess, retrievedJobSuccess, retrievedUserBookmarkSuccess,  } from '../actions/job-post.actions';
import { JobPostService } from '../../service/job-post.service';

@Injectable()
export class JobPostEffects {
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

  constructor(
    private actions$: Actions,
    private jobPostService: JobPostService
  ) {}
}