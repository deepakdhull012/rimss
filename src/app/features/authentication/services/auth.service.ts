import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoginCredentials, IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = environment.BASE_API_URL;
  public loggedInUser?: IUser;

  constructor(private http: HttpClient, private router: Router) {}

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
            this.loggedInUser = matchingUsers[0];
            localStorage.setItem(
              'loggedInUser',
              JSON.stringify(this.loggedInUser)
            );
            localStorage.setItem('loggedInEmail', matchingUserEmail);
            return true;
          } else {
            return false;
          }
        })
      );
  }

  public getUser(): IUser | undefined {
    return (
      this.loggedInUser ||
      JSON.parse(localStorage.getItem('loggedInUser') || '{}')
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['auth']);
  }

  public getLoggedInEmail(): string | undefined {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('loggedInEmail') || undefined;
    } else {
      return undefined;
    }
  }
}
