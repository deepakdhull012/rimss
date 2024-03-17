import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OrderService } from './order.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        LoggerModule.forRoot({
          level: NgxLoggerLevel.LOG,
        }),
      ],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
