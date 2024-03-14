import { TestBed } from '@angular/core/testing';

import { SalesService } from './sales.service';
import { HttpClientModule } from '@angular/common/http';

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SalesService]
    });
    service = TestBed.inject(SalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
