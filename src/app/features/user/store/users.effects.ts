import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as UsersActions from './users.actions';
import * as AuthActions from './../../authentication/store/auth.actions';
import { UserService } from 'src/app/api/user.service';
import { NGXLogger } from 'ngx-logger';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Injectable()
export class UserEffect {
  userEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UsersActions.createAddress,
        UsersActions.updateAddress,
        UsersActions.deleteAddress,
        UsersActions.makePrimaryAddress,
        UsersActions.fetchAddresses
      ),
      mergeMap((action) => {
        this.logger.log(`Users effect: received action: ${action.type}`);
        switch (action.type) {
          case UsersActions.createAddress.type:
            return this.userService.addAddress(action.address).pipe(
              map(() => {
                this.logger.log(
                  `Users effect: Success for action: ${action.type}`
                );
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Users effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case UsersActions.updateAddress.type:
            return this.userService.updateAddress(action.address).pipe(
              map(() => {
                this.logger.log(
                  `Users effect: Success for action: ${action.type}`
                );
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Users effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case UsersActions.deleteAddress.type:
            return this.userService.deleteAddress(action.addressId).pipe(
              map(() => {
                this.logger.log(
                  `Users effect: Success for action: ${action.type}`
                );
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Users effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case UsersActions.makePrimaryAddress.type:
            return this.userService.markAsPrimaryAddress(action.addressId).pipe(
              map(() => {
                this.logger.log(
                  `Users effect: Success for action: ${action.type}`
                );
                const loggedInUser = this.authUtilService.getUser();
                return {
                  type: AuthActions.fetchUserDetails.type,
                  userId: loggedInUser?.id
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Users effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case UsersActions.fetchAddresses.type:
            return this.userService.getUserAddresses().pipe(
              map((addresses) => {
                this.logger.log(
                  `Users effect: Success for action: ${action.type} with response ${addresses}`
                );
                return {
                  type: UsersActions.loadAddresses.type,
                  addresses,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Users effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          default:
            return of(null).pipe(
              map(() => ({
                type: UsersActions.loadAddresses.type,
                addresses: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private logger: NGXLogger,
    private authUtilService: AuthUtilService
  ) {}
}
