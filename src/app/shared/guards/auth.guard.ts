import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BannerType } from '../interfaces/client/banner.interface';
import { BannerService } from '../services/banner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router, private bannerService: BannerService) {

  }
  
  public canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        return true;
      } else {
        this.bannerService.displayBanner.next({
          closeIcon: true,
          closeTime: 3000,
          message: "Please login to perform the action",
          type: BannerType.WARN
        })
        this.router.navigate(['auth']);
        return false;
      }
   
  }
  
}
