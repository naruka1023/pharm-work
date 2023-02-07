import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {catchError, map, mergeMap, switchMap, take} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import { getCurrentUser, setCurrentUser } from '../actions/users.action';
import { UserService } from 'src/app/service/user.service';

@Injectable()
export class UsersEffect {
  loadUser$ = createEffect(() =>
  
  this.actions$.pipe(
    ofType(getCurrentUser),
    mergeMap((action) => 
    this.userService.getUser(action.uid)
    .pipe(
      take(1),
      map((user) => (
        setCurrentUser({user:user})),
      catchError(() => EMPTY)
      ))
    )
  )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}