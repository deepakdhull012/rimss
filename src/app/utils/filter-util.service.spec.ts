import { TestBed } from '@angular/core/testing';

import { FilterUtilService } from './filter-util.service';

describe('FilterUtilService', () => {
  let service: FilterUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
