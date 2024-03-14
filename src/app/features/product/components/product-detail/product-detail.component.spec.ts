import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductDetailComponent } from './product-detail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IProductInfo } from './../../../../shared/interfaces/client/product.interface';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthUtilService } from 'src/app/utils/auth-util.service';
import { IProductDetailsTab } from '../../interfaces/product-info.interface';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let store: MockStore;
  let authUtilService: jasmine.SpyObj<AuthUtilService>;

  beforeEach(async () => {
    authUtilService = jasmine.createSpyObj('AuthUtilService', [
      'getLoggedInEmail',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        TranslateService,
        provideMockStore(),
        { provide: AuthUtilService, useValue: authUtilService },
      ],
      declarations: [ProductDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should checkout', () => {
    component.product = getProduct();
    component.gotoCheckout();
    expect(component['orderSummary']).toBeDefined();
  });

  it('should add to cart', () => {
    component.product = getProduct();
    authUtilService.getLoggedInEmail.and.returnValue('Mock data');
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    component.addToCart();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should add to wish-list', () => {
    component.product = getProduct();
    authUtilService.getLoggedInEmail.and.returnValue('Mock data');
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    component.addToWishList();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should activate tab', () => {
    component.activateTab(IProductDetailsTab.SELLER);
    expect(component.activeTab).toBe(IProductDetailsTab.SELLER);
  })

  it('should update qty', () => {
    component.qty = 2;
    component.noOfUnitsInStock = 5;
    component.updateQty(1);
    expect(component.qty).toBe(3);
  })

  function getProduct(): IProductInfo {
    return {
      currency: 'INR',
      id: 1,
      mainImage: '',
      price: 100,
      priceAfterDiscount: 90,
      productBrief: '',
      productName: 'My awesome product',
      rating: 5,
      availableColors: ['RED'],
    };
  }
});
