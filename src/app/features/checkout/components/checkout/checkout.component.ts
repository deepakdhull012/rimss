import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { IAddress } from 'src/app/features/user/interfaces/profile.interface';
import { UserService } from 'src/app/features/user/services/user.service';

@Component({
  selector: 'rimss-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [UserService],
})
export class CheckoutComponent extends BaseComponent implements OnInit {
  public loggedInEmail?: string;
  public addresses: IAddress[] = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loggedInEmail = this.authService.getLoggedInEmail();
    this.userService
      .getUserAddresses()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((addresses) => {
        this.addresses = addresses;
      });
  }

  placeOrder(): void {
    this.router.navigate(['thank-you']);
  }
}
