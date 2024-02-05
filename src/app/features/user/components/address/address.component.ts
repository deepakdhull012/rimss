import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IAddress } from '../../interfaces/profile.interface';
import { UserService } from '../../services/user.service';
import { AuthUtilService } from 'src/app/utils/auth-util.service';

@Component({
  selector: 'rimss-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent extends BaseComponent implements OnInit {
  public addressForm: FormGroup = {} as FormGroup;
  public isEditMode = false;
  public isSubmitted = false;
  @Input() standalone = true;
  @Output() addressSave: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private authUtilService: AuthUtilService,
    private userService: UserService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.composeForm();
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    if (this.addressForm.valid) {
      const addressToPost = this.mapToAddressInfo();
      this.userService
        .addAddress(addressToPost)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (_) => {
            if (this.standalone) {
              this.router.navigate(['profile']);
            } else {
              this.isSubmitted = false;
              this.composeForm();
              this.addressSave.next();
            }
          },
        });
    }
  }

  public getError(controlName: string): string | null {
    const hasError = this.isControlTouched(controlName)
      ? this.addressForm.get(controlName)?.invalid || false
      : false;
    if (hasError) {
      const errors = this.addressForm.get(controlName)?.errors;
      console.error('errors', errors);
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

  private composeForm(): void {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      line1: ['', [Validators.required]],
      line2: ['', [Validators.required]],
      city: ['', Validators.required],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
    });
  }

  private isControlTouched(controlName: string): boolean {
    return this.addressForm.get(controlName)?.touched || this.isSubmitted;
  }

  private mapToAddressInfo(): IAddress {
    return {
      firstName: this.addressForm.get('firstName')?.value,
      lastName: this.addressForm.get('lastName')?.value,
      city: this.addressForm.get('city')?.value,
      userEmail: this.authUtilService.getLoggedInEmail() || '',
      line1: this.addressForm.get('line1')?.value,
      line2: this.addressForm.get('line2')?.value,
      mobile: this.addressForm.get('mobile')?.value,
      pincode: this.addressForm.get('pincode')?.value,
      state: this.addressForm.get('state')?.value,
    };
  }
}
