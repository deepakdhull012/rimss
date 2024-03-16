import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IUser } from 'src/app/features/authentication/interfaces/user.interface';
import { IAddress } from 'src/app/features/user/interfaces/profile.interface';
import { IOrderSummary, OrderStatus } from 'src/app/shared/interfaces/client/order.interface';
import { PaymentMode } from '../../interfaces/payment.interface';
import { Store } from '@ngrx/store';
import * as CartWishlistActions from '../../../cart-wishlist/store/cart-wishlist.actions';
import * as OrdersActions from '../../../orders/store/orders.actions';
import * as UserActions from '../../../user/store/users.actions';
import { selectCartProducts } from 'src/app/features/cart-wishlist/store/cart-wishlist.selectors';
import { IAppState } from 'src/app/core/store/app.state';
import { selectOrders } from '../../store/orders.selectors';
import { AuthUtilService } from 'src/app/utils/auth-util.service';
import { selectAddresses } from 'src/app/features/user/store/users.selectors';

@Component({
  selector: 'rimss-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
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
    private authUtilService: AuthUtilService,
    private store: Store<IAppState>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loggedInEmail = this.authUtilService.getLoggedInEmail();
    this.loggedInUser = this.authUtilService.getUser();
    this.orderSummary = window.history.state?.orderSummary;
    this.fetchAddresses();
  }

  public chooseAddNewAddress(): void {
    this.useAddNewAddress = !this.useAddNewAddress;
  }

  /**
   * Dispatch action to create order
   */
  public makeOrder(): void {
    const user = this.authUtilService.getUser();
    if (this.orderSummary && this.defaultAddressIdForOrder && user) {
      this.store.dispatch(
        OrdersActions.createOrder({
          order: {
            addressId: this.defaultAddressIdForOrder,
            deliveryCharges: this.orderSummary?.deliveryCharges,
            discountedPrice: this.orderSummary?.discountedPrice,
            orderAmount: this.orderSummary.orderAmount,
            originalPrice: this.orderSummary.originalPrice,
            productOrders: this.orderSummary.productOrders,
            tax: this.orderSummary.tax,
            userId: user.id as number,
            couponCode: this.orderSummary.couponCode,
            orderDate: new Date(),
            orderStatus: OrderStatus.ACCEPTED
          },
        })
      );
      this.store
        .select(selectOrders)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(() => {
          if (this.orderSummary?.fromcart) {
            this.store.dispatch(CartWishlistActions.clearCartItems());
          }
          this.store
            .select(selectCartProducts)
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe(() => {
              this.router.navigate(['orders']);
            });
        });
    }
  }

  /**
   * Fetch user addresses
   */
  public fetchAddresses(): void {
    this.store.dispatch(UserActions.fetchAddresses());
    this.store
      .select(selectAddresses)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: (addresses) => {
          this.addresses = addresses;
          this.setDefaultAddressId();
        },
      });
  }

  /**
   * Set the deafult address flag based on user profile
   */
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
}
