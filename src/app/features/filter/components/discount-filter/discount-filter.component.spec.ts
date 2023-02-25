import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DiscountFilterComponent } from './discount-filter.component';

describe('DiscountFilterComponent', () => {
  let component: DiscountFilterComponent;
  let fixture: ComponentFixture<DiscountFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [ DiscountFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
