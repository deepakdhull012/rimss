import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as UsersActions from './users.actions';
import { UserService } from 'src/app/api/user.service';

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
        console.error('User Effect for ', action.type);
        switch (action.type) {
          case UsersActions.createAddress.type:
            return this.userService.addAddress(action.address).pipe(
              map((_) => {
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => EMPTY)
            );
          case UsersActions.updateAddress.type:
            return this.userService.updateAddress(action.address).pipe(
              map((_) => {
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => EMPTY)
            );
          case UsersActions.deleteAddress.type:
            return this.userService.deleteAddress(action.addressId).pipe(
              map((_) => {
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => EMPTY)
            );
          case UsersActions.makePrimaryAddress.type:
            return this.userService.markAsPrimaryAddress(action.addressId).pipe(
              map((_) => {
                return {
                  type: UsersActions.fetchAddresses.type,
                };
              }),
              catchError(() => EMPTY)
            );
          case UsersActions.fetchAddresses.type:
            return this.userService.getUserAddresses().pipe(
              map((addresses) => {
                return {
                  type: UsersActions.loadAddresses.type,
                  addresses,
                };
              }),
              catchError(() => EMPTY)
            );
          default:
            return of(null).pipe(
              map((_) => ({
                type: UsersActions.loadAddresses.type,
                addresses: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}
