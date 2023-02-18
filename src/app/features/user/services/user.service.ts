import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { IUser } from '../../authentication/interfaces/user.interface';
import { AuthService } from '../../authentication/services/auth.service';
import { IAddress } from '../interfaces/profile.interface';

@Injectable()
export class UserService implements OnDestroy {
  private userEmail?: string;
  private serviceDestroyed$ = new Subject<void>();
  private BASE_URL = 'http://localhost:3000';
  public addressUpdated$ = new Subject<void>();

  constructor(private authService: AuthService, private http: HttpClient) {
    this.userEmail = this.authService.getLoggedInEmail();
  }

  getUserAddresses(): Observable<IAddress[]> {
    return this.http
      .get<IAddress[]>(`${this.BASE_URL}/addresses?userEmail=${this.userEmail}`)
      .pipe(takeUntil(this.serviceDestroyed$));
  }

  addAddress(addressPayload: IAddress): Observable<void> {
    return this.http
      .post<void>(`${this.BASE_URL}/addresses`, addressPayload)
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
  }

  deleteAddress(addressId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/addresses/${addressId}`)
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
  }

  updateAddress(addressPayload: IAddress, addressId: number): Observable<void> {
    return this.http
      .put<void>(`${this.BASE_URL}/addresses/${addressId}`, addressPayload)
      .pipe(takeUntil(this.serviceDestroyed$),
      tap(_ => {
        this.addressUpdated$.next();
      }));
  }

  markAsPrimaryAddress(addressId: number): Observable<void> {
    const user: IUser | undefined = this.authService.getUser();
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


  ngOnDestroy(): void {
    this.serviceDestroyed$.next();
  }
}
