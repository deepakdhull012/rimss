import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressComponent } from './components/address/address.component';
import { UserComponent } from './components/user/user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserService } from '../../api/user.service';
import { AddressCardComponent } from './components/address-card/address-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userFeatureKey, userReducer } from './store/users.reducers';
import { UserEffect } from './store/users.effects';

@NgModule({
  declarations: [UserComponent, AddressComponent, AddressCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    UserRoutingModule,
    StoreModule.forFeature(userFeatureKey, userReducer),
    EffectsModule.forFeature(UserEffect),
  ],
  exports: [AddressComponent, AddressCardComponent],
  providers: [UserService],
})
export class UserModule {}
