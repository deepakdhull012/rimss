import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthenticationRoutingModule } from './authentication.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatRadioModule } from '@angular/material';
import { AuthService } from './services/auth.service';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';



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
    MatFormFieldModule
  ],
  providers: []
})
export class AuthenticationModule { }
