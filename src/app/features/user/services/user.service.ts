import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../../authentication/interfaces/user.interface';
import { IAddress } from '../interfaces/profile.interface';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Injectable()
export class UserService implements OnDestroy {
  private userEmail?: string;
  private serviceDestroyed$ = new Subject<void>();
  private BASE_URL = environment.BASE_API_URL;
  public addressUpdated$ = new Subject<void>();

  constructor(private authUtilService: AuthUtilService, private http: HttpClient) {
    this.userEmail = this.authUtilService.getLoggedInEmail();
  }

  public getUserAddresses(): Observable<IAddress[]> {
    return this.http
      .get<IAddress[]>(`${this.BASE_URL}/addresses?userEmail=${this.userEmail}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  public addAddress(addressPayload: IAddress): Observable<void> {
    return this.http
      .post<void>(`${this.BASE_URL}/addresses`, addressPayload)
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
  }

  public deleteAddress(addressId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/addresses/${addressId}`)
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
  }

  public updateAddress(addressPayload: IAddress, addressId: number): Observable<void> {
    return this.http
      .put<void>(`${this.BASE_URL}/addresses/${addressId}`, addressPayload)
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
  }

  public markAsPrimaryAddress(addressId: number): Observable<void> {
    const user: IUser | undefined = this.authUtilService.getUser();
    if (user) {
      return this.http
      .patch<void>(`${this.BASE_URL}/users/${user.id}`, {
        primaryAddressId: addressId
      })
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
    } else {
      return of(undefined);
    }
    
  }


  public ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}
