import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ILoginCredentials,
  IUser,
} from '../features/authentication/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base url refers to hosted sever endpoint, it can be different for different environments and can point to localhost for local
  private BASE_URL = environment.BASE_API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Save the user to db and update the status
   * @param user : IUser
   * @returns Observable<boolean>
   */
  public signup(user: IUser): Observable<boolean> {
    return this.http.post(`${this.BASE_URL}/users`, user).pipe(
      map(() => {
        return true;
      }),
      catchError(() => of(false)));
  }

  /**
   * Provide user details of selected user
   * @param userId : number
   * @returns : Observable<IUser>
   */
  public getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.BASE_URL}/users/${userId}`);
  }

  /**
   * Login and return true or false based on status
   * @param credentials : ILoginCredentials
   * @returns Observable<boolean>
   */
  public login(credentials: ILoginCredentials): Observable<boolean> {
    return this.http
      .get<Array<IUser>>(
        `${this.BASE_URL}/users?email=${credentials.email}&password=${credentials.password}`
      )
      .pipe(
        map((matchingUsers: Array<IUser>) => {
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
