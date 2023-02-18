import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { ILoginCredentials, IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:3000';
  public loggedInUser?: IUser;

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: IUser): Observable<boolean> {
    return this.http.post(`${this.BASE_URL}/users`, user).pipe(
      map((res) => {
        return true;
      })
    );
  }

  login(credentials: ILoginCredentials): Observable<string | null> {
    return this.http
      .get<Array<IUser>>(
        `${this.BASE_URL}/users?email=${credentials.email}&password=${credentials.password}`
      )
      .pipe(
        map((matchingUsers) => {
          if(matchingUsers?.length) {
            const matchingUserEmail = matchingUsers[0].email;
            this.loggedInUser = matchingUsers[0];
            localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
            localStorage.setItem("loggedInEmail", matchingUserEmail);
            return this.getToken();
          } else {
            return null;
          }
          
        })
      );
  }

  private getToken() {
    return this.randomGenerator() + this.randomGenerator(); // to make it longer
  }

  private randomGenerator(): string {
    return Math.random().toString(36).substr(2);
  }

  public getUser(): IUser | undefined {
    return this.loggedInUser || JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInEmail");
    localStorage.removeItem("loggedInUser");
    this.router.navigate(['auth']);
  }

  getLoggedInEmail(): string | undefined {
    if (localStorage.getItem("token")) {
      return localStorage.getItem("loggedInEmail") || undefined;
    } else {
      return undefined;
    }
    
  }
}
