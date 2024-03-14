import { Injectable } from '@angular/core';
import { IUser } from '../features/authentication/interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthUtilService {



  constructor(private router: Router) { }

  public getUser(): IUser | undefined {
    return (
      JSON.parse(localStorage.getItem('loggedInUser') || '{}')
    );
  }

  public logout(): void {
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['auth']);
  }

  public getLoggedInEmail(): string | undefined {
    if (localStorage.getItem('loggedInUser')) {
      return localStorage.getItem('loggedInEmail') || undefined;
    } else {
      return undefined;
    }
  }
}
