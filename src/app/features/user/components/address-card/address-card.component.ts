import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IAddress } from '../../interfaces/profile.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'rimss-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss']
})
export class AddressCardComponent extends BaseComponent {

  @Input() address?: IAddress;
  @Input() readMode = false;

  constructor(private userService: UserService) { 
    super();
  }

  public makeDefault(): void {
    this.userService.markAsPrimaryAddress(this.address?.id as number).subscribe();
  }

  public deleteAddress(): void {
    this.userService.deleteAddress(this.address?.id as number).subscribe();
  }

  public editAddress(): void {

  }

}
