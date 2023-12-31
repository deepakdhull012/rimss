import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BannerType } from 'src/app/shared/interfaces/client/banner.interface';
import { BannerService } from 'src/app/shared/services/banner.service';
import { PASSWORD_MIN_LENGTH } from '../../consts/auth.const';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'rimss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = {} as FormGroup;
  private isSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private bannerService: BannerService
  ) {}

  public ngOnInit(): void {
    this.composeForm();
  }

  public login(): void {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.authService
      .login({
        email: this.loginForm.value['email'],
        password: this.loginForm.value['password'],
      })
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
            message: "Invalid credentials",
            type: BannerType.ERROR
          })
        }
      });
    } else {
      this.bannerService.displayBanner.next({
        closeIcon: true,
        closeTime: 3000,
        message: "Please correct the errors",
        type: BannerType.ERROR
      })
    }
  }

  public getError(controlName: string): string | null {
    const hasError = this.isControlTouched(controlName) ? this.loginForm.get(controlName)?.invalid || false : false;
    if (hasError) {
      const errors = this.loginForm.get(controlName)?.errors;
      if (errors && errors["required"]) {
        return `${controlName} is required.`;
      } else if (errors && errors["email"]) {
        return `Invalid email.`;
      }  else {
        return null;
      }
    }
    return null;
  }

  private composeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }


  private isControlTouched(controlName: string): boolean {
    return this.loginForm.get(controlName)?.touched || this.isSubmitted;
  }
}
