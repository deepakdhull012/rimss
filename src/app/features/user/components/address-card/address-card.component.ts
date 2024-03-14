import { Component, Input } from '@angular/core';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IAddress } from '../../interfaces/profile.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as UserActions from './../../store/users.actions';

@Component({
  selector: 'rimss-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent extends BaseComponent {
  @Input() address?: IAddress;
  @Input() readMode = false;

  constructor(private store: Store<IAppState>) {
    super();
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
