import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrandFilterComponent } from './brand-filter.component';

describe('BrandFilterComponent', () => {
  let component: BrandFilterComponent;
  let fixture: ComponentFixture<BrandFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [ BrandFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
