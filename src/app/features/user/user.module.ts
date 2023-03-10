import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressComponent } from './components/address/address.component';
import { UserComponent } from './components/user/user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from './services/user.service';
import { AddressCardComponent } from './components/address-card/address-card.component';
import { MatButtonModule, MatCardModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserComponent,
    AddressComponent,
    AddressCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    UserRoutingModule
  ],
  exports: [AddressComponent, AddressCardComponent],
  providers: [UserService]
})
export class UserModule { }
