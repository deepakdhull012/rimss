import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from 'src/app/api/auth.service';

@Injectable()
export class AuthEffect {
  authEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login, AuthActions.signUp),
      mergeMap((action) => {
        console.error('Auth Effect for ', action.type);
        switch (action.type) {
          case AuthActions.login.type:
            return this.authService.login(action.credentials).pipe(
              map((loginStatus) => {
                console.error("returning login status", loginStatus)
                return {
                  type: AuthActions.updateLoginStatus.type,
                  isLoggedIn: loginStatus,
                };
              }),
              catchError(() => EMPTY)
            );
          case AuthActions.signUp.type:
            return this.authService.signup(action.user).pipe(
              map((_) => {
                return {
                  type: AuthActions.updateLoginStatus.type,
                  isLoggedIn: false,
                };
              }),
              catchError(() => EMPTY)
            );
          default:
            console.error("default action")
            return of(null).pipe(
              map((_) => ({
                type: AuthActions.updateLoginStatus.type,
                  isLoggedIn: false,
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
