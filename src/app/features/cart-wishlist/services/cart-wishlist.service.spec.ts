import { TestBed } from '@angular/core/testing';

import { CartWishlistService } from './cart-wishlist.service';

describe('CartWishlistService', () => {
  let service: CartWishlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartWishlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
