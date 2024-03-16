import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../features/authentication/interfaces/user.interface';
import { IAddress } from '../features/user/interfaces/profile.interface';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Injectable()
export class UserService implements OnDestroy {
  private userEmail?: string;
  private serviceDestroyed$ = new Subject<void>();
  private BASE_URL = environment.BASE_API_URL;
  public addressUpdated$ = new Subject<void>();

  constructor(
    private authUtilService: AuthUtilService,
    private http: HttpClient
  ) {
    this.userEmail = this.authUtilService.getLoggedInEmail();
  }

  /**
   * Fetch user addresses
   * @returns Observable<IAddress[]>
   */
  public getUserAddresses(): Observable<IAddress[]> {
    return this.http
      .get<IAddress[]>(`${this.BASE_URL}/addresses?userEmail=${this.userEmail}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  /**
   * Add new address
   * @param addressPayload : IAddress
   * @returns Observable<void>
   */
  public addAddress(addressPayload: IAddress): Observable<void> {
    return this.http
      .post<void>(`${this.BASE_URL}/addresses`, addressPayload)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap(() => {
          this.addressUpdated$.next();
        })
      );
  }

  /**
   * Delete an address
   * @param addressId : number
   * @returns Observable<void>
   */
  public deleteAddress(addressId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/addresses/${addressId}`)
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap(() => {
          this.addressUpdated$.next();
        })
      );
  }

  /**
   * Update an address
   * @param addressPayload : IAddress
   * @returns Observable<void>
   */
  public updateAddress(addressPayload: IAddress): Observable<void> {
    return this.http
      .put<void>(
        `${this.BASE_URL}/addresses/${addressPayload.id}`,
        addressPayload
      )
      .pipe(
        takeUntil(this.serviceDestroyed$),
        tap(() => {
          this.addressUpdated$.next();
        })
      );
  }

  /**
   * Set as primary address for current user
   * @param addressId : number
   * @returns Observable<void>
   */
  public markAsPrimaryAddress(addressId: number): Observable<void> {
    const user: IUser | undefined = this.authUtilService.getUser();
    if (user) {
      return this.http
        .patch<void>(`${this.BASE_URL}/users/${user.id}`, {
          primaryAddressId: addressId,
        })
        .pipe(
          takeUntil(this.serviceDestroyed$),
          tap(() => {
            const currentUser = this.authUtilService.getUser();
            if (currentUser) {
              currentUser.primaryAddressId = addressId;
            }
            localStorage.setItem('loggedInUser', JSON.stringify(currentUser));
            this.addressUpdated$.next();
          })
        );
    } else {
      return of(undefined);
    }
  }

  /**
   * Life cycle hook to clean up resources
   */
  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}
