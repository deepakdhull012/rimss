import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IUser } from 'src/app/features/authentication/interfaces/user.interface';
import { IAddress } from '../../interfaces/profile.interface';
import { UserService } from '../../services/user.service';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Component({
  selector: 'rimss-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent extends BaseComponent implements OnInit {
  public user?: IUser;
  public addresses: IAddress[] = [];

  constructor(
    private authUtilService: AuthUtilService,
    private userService: UserService,
    private router: Router
  ) {
    super();
    this.user = this.authUtilService.getUser();
  }

  public ngOnInit(): void {
    this.userService.addressUpdated$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (_) => {
          this.getAddresses();
        },
      });
    this.getAddresses();
  }

  public addAddress(): void {
    this.router.navigate(['profile', 'addresses']);
  }

  private getAddresses(): void {
    this.userService
      .getUserAddresses()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((addresses) => {
        this.addresses = addresses;
      });
  }
}
