import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CartWishlistService } from './cart-wishlist.service';

describe('CartWishlistService', () => {
  let service: CartWishlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
    });
    service = TestBed.inject(CartWishlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
