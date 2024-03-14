import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthenticationRoutingModule } from './authentication.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authFeatureKey, authReducer } from './store/auth.reducers';
import { AuthEffect } from './store/auth.effects';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    AuthenticationRoutingModule,
    MatFormFieldModule,
    StoreModule.forFeature(authFeatureKey, authReducer),
    EffectsModule.forFeature(AuthEffect),
  ],
  providers: []
})
export class AuthenticationModule { }
