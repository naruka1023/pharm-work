import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, map,switchMap, take} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import { JobService } from 'src/app/operator/service/job.service';
import { jobPostModel } from '../../model/jobPost.model';

@Injectable()
export class JobPostEffects {

  constructor(
    private actions$: Actions,
    private jobService: JobService
  ) {}
}