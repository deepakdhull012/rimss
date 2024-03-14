import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ProductsService } from '../../../api/products.service';
import * as ProductActions from './products.actions';
import { SalesService } from 'src/app/api/sales.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ProductsEffects {
  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ProductActions.fetchProductsByCatgory,
        ProductActions.fetchProducts,
        ProductActions.fetchProductsBySearchCritera,
        ProductActions.fetchSimilarProducts,
        ProductActions.fetchProductById,
        ProductActions.fetchRecommendedProducts,
        ProductActions.fetchBannerSales
      ),
      mergeMap((action) => {
        this.logger.log(`Products effect: received action: ${action.type}`);
        switch (action.type) {
          case ProductActions.fetchProductsByCatgory.type:
            return this.productsServie
              .filterProductsByCriteria(action.filterCriteria, action.sortBy)
              .pipe(
                map((products) => {
                  this.logger.log(
                    `Products effect: Success for action: ${action.type} with response ${products}`
                  );
                  return {
                    type: ProductActions.loadProducts.type,
                    products: products,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Products effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );
          case ProductActions.fetchProducts.type:
            return this.productsServie.fetchAllProducts().pipe(
              map((products) => {
                this.logger.log(
                  `Products effect: Success for action: ${action.type} with response ${products}`
                );
                return {
                  type: ProductActions.loadProducts.type,
                  products: products,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Products effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          case ProductActions.fetchProductsBySearchCritera.type:
            return this.productsServie
              .fetchProductsBySearchCriteria(action.searchtext)
              .pipe(
                map((products) => {
                  this.logger.log(
                    `Products effect: Success for action: ${action.type} with response ${products}`
                  );
                  return {
                    type: ProductActions.loadProducts.type,
                    products: products,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Products effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );

          case ProductActions.fetchSimilarProducts.type:
            return this.productsServie
              .filterProductsByCriteria(action.filterCriteria)
              .pipe(
                map((products) => {
                  this.logger.log(
                    `Products effect: Success for action: ${action.type} with response ${products}`
                  );
                  return {
                    type: ProductActions.loadSimilarProducts.type,
                    similarProducts: products,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Products effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );

          case ProductActions.fetchRecommendedProducts.type:
            return this.productsServie
              .filterProductsByCriteria(action.filterCriteria)
              .pipe(
                map((products) => {
                  this.logger.log(
                    `Products effect: Success for action: ${action.type} with response ${products}`
                  );
                  return {
                    type: ProductActions.loadRecommendedProducts.type,
                    recommendedProducts: products,
                  };
                }),
                catchError(() => {
                  this.logger.error(
                    'Products effect: Error in action: ' + action.type
                  );
                  return EMPTY;
                })
              );

          case ProductActions.fetchProductById.type:
            return this.productsServie.fetchProductById(action.productId).pipe(
              map((product) => {
                this.logger.log(
                  `Products effect: Success for action: ${action.type} with response ${product}`
                );
                return {
                  type: ProductActions.selectProduct.type,
                  selectedproduct: product,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Products effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );

          case ProductActions.fetchBannerSales.type:
            return this.salesService.fetchAllBannerSales().pipe(
              map((bannerSales) => {
                this.logger.log(
                  `Products effect: Success for action: ${action.type} with response ${bannerSales}`
                );
                return {
                  type: ProductActions.loadBannerSales.type,
                  bannerSales,
                };
              }),
              catchError(() => {
                this.logger.error(
                  'Products effect: Error in action: ' + action.type
                );
                return EMPTY;
              })
            );
          default:
            return of(null).pipe(
              map(() => ({
                type: ProductActions.loadProducts.type,
                payload: [],
              })),
              catchError(() => EMPTY)
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private productsServie: ProductsService,
    private salesService: SalesService,
    private logger: NGXLogger
  ) {}
}
