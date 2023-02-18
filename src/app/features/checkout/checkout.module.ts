import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutRoutingModule } from './checkout.routes';
import { UserModule } from '../user/user.module';
import { MatRadioModule } from '@angular/material';



@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    UserModule,
    MatRadioModule
  ]
})
export class CheckoutModule { }
