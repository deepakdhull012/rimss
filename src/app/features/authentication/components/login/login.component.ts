import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/core/store/app.state';
import * as AuthActions from './../../store/auth.actions';
import { selectLoginStatus } from '../../store/auth.selectors';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';

@Component({
  selector: 'rimss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  public loginForm: FormGroup = {} as FormGroup;
  private isSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<IAppState>,
    private bannerService: BannerService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.composeForm();
  }

  /**
   * call login api try login 
   */
  public login(): void {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.store.dispatch(
        AuthActions.login({
          credentials: {
            email: this.loginForm.value['email'],
            password: this.loginForm.value['password'],
          },
        })
      );

      setTimeout(() => {
        this.store
          .select(selectLoginStatus)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe((success: boolean) => {
            if (success) {
              const redirectionPage = sessionStorage.getItem('redirectionPage');
              if (!redirectionPage) {
                this.router.navigate(['products', 'list']);
              }
            } else {
              this.bannerService.displayBanner.next({
                closeIcon: true,
                closeTime: 3000,
                message: 'Invalid credentials',
                type: BannerType.ERROR,
              });
            }
          });
      }, 1000);
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 3000,
        message: 'Please correct the errors',
        type: BannerType.ERROR,
      });
    }
  }

  /**
   * Provides error on a form control
   * @param controlName : string
   * @returns string | null
   */
  public getError(controlName: string): string | null {
    const hasError = this.isControlTouched(controlName)
      ? this.loginForm.get(controlName)?.invalid || false
      : false;
    if (hasError) {
      const errors = this.loginForm.get(controlName)?.errors;
      if (errors && errors['required']) {
        return `${controlName} is required.`;
      } else if (errors && errors['email']) {
        return `Invalid email.`;
      } else {
        return null;
      }
    }
    return null;
  }


  /**
   * Compose the form
   */
  private composeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Tells if a control has been touched or not
   * @param controlName : string
   * @returns boolean
   */
  private isControlTouched(controlName: string): boolean {
    return this.loginForm.get(controlName)?.touched || this.isSubmitted;
  }
}
