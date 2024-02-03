import { createSelector } from "@ngrx/store";
import { IAppState } from "src/app/core/store/app.state";
import { IProductState } from "./products.state";

export const selectProductState = (state: IAppState) => state.products;

export const selectProducts = createSelector(
    selectProductState,
  (state: IProductState) => state.products
);