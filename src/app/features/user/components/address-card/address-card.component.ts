import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IAddress } from '../../interfaces/profile.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'rimss-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss']
})
export class AddressCardComponent extends BaseComponent implements OnInit {

  @Input() address?: IAddress;

  constructor(private userService: UserService) { 
    super();
  }

  ngOnInit(): void {
  }

  makeDefault(): void {
    this.userService.markAsPrimaryAddress(this.address?.id as number).subscribe();
  }

  deleteAddress(): void {
    this.userService.deleteAddress(this.address?.id as number).subscribe();
  }

  editAddress(): void {

  }

}
