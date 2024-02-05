import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './components/orders/orders.component';
import { OrdersRoutingModule } from './orders.routes';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserModule } from '../user/user.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { orderReducer, ordersFeatureKey } from './store/orders.reducers';
import { EffectsModule } from '@ngrx/effects';
import { OrdersEffect } from './store/orders.effects';

@NgModule({
  declarations: [OrdersComponent, CheckoutComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    UserModule,
    MatRadioModule,
    MatButtonModule,
    StoreModule.forFeature(ordersFeatureKey, orderReducer),
    EffectsModule.forFeature(OrdersEffect),
  ],
})
export class OrdersModule {}
