import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { PASSWORD_MIN_LENGTH } from '../../consts/auth.const';
import { IUser } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.composeForm();
  }

  composeForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]],
      gender: ['M', Validators.required]
    })
  }

  navigateTo(path: Array<string>) {
    this.router.navigate(path);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.signupForm.valid) {
      const userToPost = this.mapToUserInfo();
      this.authService.signup(userToPost).pipe(takeUntil(this.componentDestroyed$)).subscribe(res => {
      })
    }
  }

  getError(controlName: string): string | null{
    const hasError = this.controlTouched(controlName) ? this.signupForm.get(controlName)?.invalid || false : false;
    if (hasError) {
      const errors = this.signupForm.get(controlName)?.errors;
      console.error("errors", errors)
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

  controlTouched(controlName: string): boolean {
    return this.signupForm.get(controlName)?.touched || this.isSubmitted;
  }

  mapToUserInfo(): IUser {
    return {
      firstName: this.signupForm.get('firstName')?.value,
      lastName: this.signupForm.get('lastName')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
      gender: this.signupForm.get('gender')?.value
    }
  }
}
