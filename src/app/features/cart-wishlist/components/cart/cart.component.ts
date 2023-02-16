import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/core/components/base/base.component';
import { IProductInfo } from 'src/app/shared/interfaces/client/product.interface';
import { ICartProduct } from '../../interfaces/cart-product.interface';
import { CartWishlistService } from '../../services/cart-wishlist.service';

@Component({
  selector: 'rimss-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent extends BaseComponent implements OnInit {

  constructor(private router: Router, private cartService: CartWishlistService) {
    super();
  }
  public cartProducts: Array<ICartProduct> = [];
  public recommendedProducts: Array<IProductInfo> = [];

  ngOnInit(): void {
    this.fetchCartProducts();
  }

  checkout(): void {
    this.router.navigate(['checkout']);
  }

  removeFromCart(cartProduct: ICartProduct): void {
    this.cartService.removeFromCart(cartProduct.id as number).pipe(takeUntil(this.componentDestroyed$)).subscribe(res => {
      this.fetchCartProducts();
    })
  }

  fetchCartProducts(): void {
    this.cartService.getCartProducts().pipe(takeUntil(this.componentDestroyed$)).subscribe(cartProducts => {
      this.cartProducts = cartProducts;
    })
  }

  fetchRecommendedProducts(): void {
    
  }


}
