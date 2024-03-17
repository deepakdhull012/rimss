import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IUser } from 'src/app/features/authentication/interfaces/user.interface';
import { IAddress } from '../../interfaces/profile.interface';
import { AuthUtilService } from 'src/app/utils/auth-util.service';
import { IAppState } from 'src/app/core/store/app.state';
import { ActionsSubject, Store } from '@ngrx/store';
import * as UserActions from './../../store/users.actions';
import { selectAddresses } from '../../store/users.selectors';

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
    private store: Store<IAppState>,
    private router: Router,
    private actionsSubject$: ActionsSubject
  ) {
    super();
    this.user = this.authUtilService.getUser();
  }

  public ngOnInit(): void {
    this.listenToActionsResponse();
    this.fetchProducts();
  }

  /**
   * Listen to actions response, such as load address success
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === UserActions.loadAddresses.type)
      )
      .subscribe(() => {
        this.loadAddressesFromStore();
      });
  }

  /**
   * Fetch addresses from server by dispatching action
   */
  private fetchProducts(): void {
    this.store.dispatch(UserActions.fetchAddresses());
  }

  /**
   * Load addreses from store
   */
  private loadAddressesFromStore(): void {
    this.store
      .select(selectAddresses)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (addresses) => {
          this.addresses = addresses;
        },
      });
  }

  public addAddress(): void {
    this.router.navigate(['profile', 'addresses']);
  }
}
