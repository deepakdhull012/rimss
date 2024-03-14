import { HttpClientTestingModule, HttpTestingController  } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductsService } from './products.service';
import { IProductServer } from '../shared/interfaces/client/product.interface';
import { takeUntil } from 'rxjs';
import { SortBy } from '../features/product/interfaces/product-info.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
    });
    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products successfully', () => {
    const mockProductsFromServer: Array<IProductServer> = [
      // Provide mock data from the server
    ];

    // Trigger the service method
    service.fetchAllProducts().pipe().subscribe((products) => {
      // Verify that the result matches the expected client-side data
      expect(products).toEqual(service["mapServerToClient"](mockProductsFromServer));
    });

    // Set up the HTTP request expectation
    const req = httpTestingController.expectOne(`${service["BASE_URL"]}/products`);
    expect(req.request.method).toBe('GET');

    // Respond with mock data from the server
    req.flush(mockProductsFromServer);
  });

  it('should fetch all products successfully', () => {
    const mockProductsFromServer: Array<IProductServer> = [
      // Provide mock data from the server
    ];

    // Trigger the service method
    service.filterProductsByCriteria({category: ["A"], filterString: "abc", saleId: 1}, SortBy.HIGH_RATED ).pipe().subscribe((products) => {
      // Verify that the result matches the expected client-side data
      expect(products).toEqual(service["mapServerToClient"](mockProductsFromServer));
    });

    // Set up the HTTP request expectation
    const req = httpTestingController.expectOne(`${service["BASE_URL"]}/products?abc&saleId=1&&productCategory_like=A&_sort=rating&_order=desc`);
    expect(req.request.method).toBe('GET');

    // Respond with mock data from the server
    req.flush(mockProductsFromServer);
  });

  it('should fetch all products successfully', () => {
    const mockProductsFromServer: IProductServer = {
      id: 1,
      currency: "",
      mainImage: '',
      price: 100,
      priceAfterDiscount: 90,
      productBrief: '',
      productName: '',
      rating: 2,

    }

    // Trigger the service method
    service.fetchProductById(1).pipe().subscribe((products) => {
      // Verify that the result matches the expected client-side data
      expect(products).toEqual(mockProductsFromServer);
    });

    // Set up the HTTP request expectation
    const req = httpTestingController.expectOne(`${service["BASE_URL"]}/products/1`);
    expect(req.request.method).toBe('GET');

    // Respond with mock data from the server
    req.flush(mockProductsFromServer);
  });
});
