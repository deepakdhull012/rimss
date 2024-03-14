import { TestBed } from '@angular/core/testing';

import { FilterUtilService } from './filter-util.service';
import { IFilterObject } from '../features/filter/interfaces/filter-config.interface';

describe('FilterUtilService', () => {
  let service: FilterUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get filter string', () => {
    const filterObject: IFilterObject = {
      selectedBrands: [1],
      selectedDiscountRanges: [1],
      selectedPriceRanges: [
        {
          displayText: "0-100",
          index: 0,
          max: 100,
          min: 0
        }
      ],
      selectedRating: [1],
      selectedSizes: ["S"],
    };
    const filterString = service.getFilterString(filterObject);
    expect(filterString).toBe('brandId=1&priceAfterDiscount_gte=0&priceAfterDiscount_lte=100&rating_gte=1&rating_lte=2&sizes_like=S&productDiscountInPercentage_gte=1');
  });
});
