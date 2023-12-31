import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BannerType } from '../interfaces/client/banner.interface';
import { BannerService } from '../services/banner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router, private bannerService: BannerService) {

  }
  
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = localStorage.getItem("token");
      if (token) {
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
