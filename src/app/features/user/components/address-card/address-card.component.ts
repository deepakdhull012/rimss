import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IAddress } from '../../interfaces/profile.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as UserActions from './../../store/users.actions';
import { takeUntil } from 'rxjs';
import { AuthUtilService } from 'src/app/utils/auth-util.service';
import { selectAuthState } from 'src/app/features/authentication/store/auth.selectors';

@Component({
  selector: 'rimss-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent extends BaseComponent implements OnInit {
  @Input() address?: IAddress;
  @Input() readMode = false;

  constructor(private store: Store<IAppState>, private authUtilService: AuthUtilService) {
    super();
  }

  public ngOnInit(): void {
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((authState) => {
        const user = authState?.user;
        console.log("user state is", user, authState)
        if (this.address) {
          this.address = {
            ...this.address,
             isPrimaryAddress: user?.primaryAddressId === this.address.id
          }
        }
        
      });
  }

  public makeDefault(): void {
    this.store.dispatch(
      UserActions.makePrimaryAddress({
        addressId: this.address?.id as number,
      })
    );
  }

  public deleteAddress(): void {
    this.store.dispatch(
      UserActions.deleteAddress({
        addressId: this.address?.id as number,
      })
    );
  }

  public editAddress(): void {}
}
