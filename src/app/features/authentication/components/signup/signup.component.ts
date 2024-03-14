import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { PASSWORD_MIN_LENGTH } from '../../consts/auth.const';
import { IUser } from '../../interfaces/user.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as AuthActions from "./../../store/auth.actions";

@Component({
  selector: 'rimss-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends BaseComponent implements OnInit {

  public signupForm: FormGroup = {} as FormGroup;
  public isSubmitted = false;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<IAppState>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.composeForm();
  }

  public navigateTo(path: Array<string>): void {
    this.router.navigate(path);
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    if (this.signupForm.valid) {
      const userToPost = this.mapToUserInfo();
      this.store.dispatch(AuthActions.signUp({
        user: userToPost
      }));
    }
  }

  public getError(controlName: string): string | null {
    const hasError = this.isControlTouched(controlName) ? this.signupForm.get(controlName)?.invalid || false : false;
    if (hasError) {
      const errors = this.signupForm.get(controlName)?.errors;
      if (errors && errors["required"]) {
        return `${controlName} is reuired`;
      } else if (errors && errors["email"]) {
        return `Invalid email`;
      } else if (errors && errors["minlength"]) {
        return `Password should be at-least 8 characters long`;
      } else {
        return null;
      }
    }
    return null;
  }

  private isControlTouched(controlName: string): boolean {
    return this.signupForm.get(controlName)?.touched || this.isSubmitted;
  }

  private mapToUserInfo(): IUser {
    return {
      firstName: this.signupForm.get('firstName')?.value,
      lastName: this.signupForm.get('lastName')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
      gender: this.signupForm.get('gender')?.value
    }
  }

  private composeForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
      gender: ['M', Validators.required]
    })
  }
}
