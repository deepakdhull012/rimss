import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoginCredentials, IUser } from '../features/authentication/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = environment.BASE_API_URL;
  

  constructor(private http: HttpClient) {}

  public signup(user: IUser): Observable<boolean> {
    return this.http.post(`${this.BASE_URL}/users`, user).pipe(
      map((res) => {
        return true;
      })
    );
  }

  public login(credentials: ILoginCredentials): Observable<boolean> {
    return this.http
      .get<Array<IUser>>(
        `${this.BASE_URL}/users?email=${credentials.email}&password=${credentials.password}`
      )
      .pipe(
        map((matchingUsers: any[]) => {
          if (matchingUsers?.length) {
            const matchingUserEmail = matchingUsers[0].email;
            localStorage.setItem(
              'loggedInUser',
              JSON.stringify(matchingUsers[0])
            );
            localStorage.setItem('loggedInEmail', matchingUserEmail);
            return true;
          } else {
            return false;
          }
        })
      );
  }
}
