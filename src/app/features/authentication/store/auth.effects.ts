import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from 'src/app/api/auth.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class AuthEffect {
  authEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login, AuthActions.signUp),
      mergeMap((action) => {
        this.logger.log(`Auth effect: received action ${action.type}`);
        switch (action.type) {
          case AuthActions.login.type:
            return this.authService.login(action.credentials).pipe(
              map((loginStatus) => {
                this.logger.log(
                  `Auth effect: Success for action: ${action.type} with response ${loginStatus}`
                );
                return {
                  type: AuthActions.updateLoginStatus.type,
                  isLoggedIn: loginStatus,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Auth effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case AuthActions.signUp.type:
            return this.authService.signup(action.user).pipe(
              map(() => {
                this.logger.log(
                  `Auth effect: Success for action: ${action.type}`
                );
                return {
                  type: AuthActions.updateLoginStatus.type,
                  isLoggedIn: false,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Auth effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          default:
            return of(null).pipe(
              map(() => ({
                type: AuthActions.updateLoginStatus.type,
                isLoggedIn: false,
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private logger: NGXLogger
  ) {}
}
