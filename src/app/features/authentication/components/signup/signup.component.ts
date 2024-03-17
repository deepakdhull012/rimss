import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { PASSWORD_MIN_LENGTH } from '../../consts/auth.const';
import { IUser } from '../../interfaces/user.interface';
import { ActionsSubject, Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as AuthActions from './../../store/auth.actions';
import { filter, takeUntil } from 'rxjs';
import { BannerService } from 'src/app/shared/services/banner.service';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';

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
    private store: Store<IAppState>,
    private bannerService: BannerService,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  public ngOnInit(): void {
    this.composeForm();
    this.listenToActionsResponse();
  }

  public navigateTo(path: Array<string>): void {
    this.router.navigate(path);
  }

  /**
   * call sign up api
   */
  public onSubmit(): void {
    this.isSubmitted = true;
    if (this.signupForm.valid) {
      const userToPost = this.mapToUserInfo();
      this.store.dispatch(
        AuthActions.signUp({
          user: userToPost,
        })
      );
    }
  }

  /**
   * Provides error on a form control
   * @param controlName : string
   * @returns string | null
   */
  public getError(controlName: string): string | null {
    const hasError = this.isControlTouched(controlName)
      ? this.signupForm.get(controlName)?.invalid || false
      : false;
    if (hasError) {
      const errors = this.signupForm.get(controlName)?.errors;
      if (errors && errors['required']) {
        return `${controlName} is reuired`;
      } else if (errors && errors['email']) {
        return `Invalid email`;
      } else if (errors && errors['minlength']) {
        return `Password should be at-least 8 characters long`;
      } else {
        return null;
      }
    }
    return null;
  }

  /**
   * Listen to actions response, such as signup success, signup failure and display message accordingly
   */
  private listenToActionsResponse(): void {
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === AuthActions.signUpSuccess.type)
      )
      .subscribe(() => {
        this.bannerService.displayBanner.next({
          type: BannerType.SUCCESS,
          message: 'Sign up success',
          closeIcon: true,
          closeTime: 3000,
        });
        this.router.navigate(['auth']);
      });
    this.actionsSubject$
      .pipe(
        takeUntil(this.componentDestroyed$),
        filter((action) => action.type === AuthActions.signUpFail.type)
      )
      .subscribe(() => {
        this.bannerService.displayBanner.next({
          type: BannerType.ERROR,
          message: 'Sign up faild',
          closeIcon: true,
          closeTime: 3000,
        });
      });
  }

  /**
   * Tells if a form control is touched or nor
   * @param controlName : string
   * @returns boolean
   */
  private isControlTouched(controlName: string): boolean {
    return this.signupForm.get(controlName)?.touched || this.isSubmitted;
  }

  /**
   * Adapter function to map form values to interface
   * @returns IUser
   */
  private mapToUserInfo(): IUser {
    return {
      firstName: this.signupForm.get('firstName')?.value,
      lastName: this.signupForm.get('lastName')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
      gender: this.signupForm.get('gender')?.value,
    };
  }

  /**
   * Compose rective form 
   */
  private composeForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)],
      ],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)],
      ],
      gender: ['M', Validators.required],
    });
  }
}
