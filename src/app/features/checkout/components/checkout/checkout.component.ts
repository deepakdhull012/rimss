import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IUser } from 'src/app/features/authentication/interfaces/user.interface';
import { AuthService } from 'src/app/features/authentication/services/auth.service';
import { CartWishlistService } from 'src/app/features/cart-wishlist/services/cart-wishlist.service';
import { IAddress } from 'src/app/features/user/interfaces/profile.interface';
import { UserService } from 'src/app/features/user/services/user.service';
import { IOrderSummary } from 'src/app/shared/interfaces/client/order.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { PaymentMode } from '../../interfaces/payment.interface';

@Component({
  selector: 'rimss-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [UserService],
})
export class CheckoutComponent extends BaseComponent implements OnInit {
  public loggedInEmail?: string;
  private loggedInUser?: IUser;
  public addresses: IAddress[] = [];
  public defaultAddressIdForOrder?: number;
  public useAddNewAddress = false;
  public orderSummary?: IOrderSummary;
  public PaymentMode = PaymentMode;
  public paymentMethod = PaymentMode.CASH_ON_DELIVERY;
  constructor(
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private authService: AuthService,
    private cartService: CartWishlistService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loggedInEmail = this.authService.getLoggedInEmail();
    this.loggedInUser = this.authService.getUser();
    this.orderSummary = window.history.state?.orderSummary;
    this.fetchAddresses();
  }

  placeOrder(): void {
    this.router.navigate(['thank-you']);
  }

  chooseAddNewAddress(): void {
    this.useAddNewAddress = !this.useAddNewAddress;
  }

  private setDefaultAddressId(): void {
    const defaultAddressOfUser = this.loggedInUser?.primaryAddressId;
    if (!defaultAddressOfUser) {
      this.defaultAddressIdForOrder = this.addresses[0]?.id || undefined;
    } else {
      const defaultAddress = this.addresses.find((address) => {
        return address.id === defaultAddressOfUser;
      });
      this.defaultAddressIdForOrder = defaultAddress?.id || undefined;
    }
  }

  makeOrder(): void {
    const user = this.authService.getUser();
    if (this.orderSummary && this.defaultAddressIdForOrder && user) {
      this.orderService
        .makeOrder({
          addressId: this.defaultAddressIdForOrder,
          deliveryCharges: this.orderSummary?.deliveryCharges,
          discountedPrice: this.orderSummary?.discountedPrice,
          orderAmount: this.orderSummary.orderAmount,
          originalPrice: this.orderSummary.originalPrice,
          productOrders: this.orderSummary.productOrders,
          tax: this.orderSummary.tax,
          userId: user.id as number,
          couponCode: this.orderSummary.couponCode,
          orderDate: new Date()
        })
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe((_) => {
          if (this.orderSummary?.fromcart) {
            this.cartService.clearCart().subscribe(_ => {
              this.router.navigate(['orders']);
            })
          }
          
        });
    }
  }

  fetchAddresses(): void {
    this.userService
      .getUserAddresses()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((addresses) => {
        this.addresses = addresses;
        this.setDefaultAddressId();
        console.error('addresses', this.addresses);
      });
  }
}
