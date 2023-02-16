import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeFilterComponent } from './size-filter.component';

describe('SizeFilterComponent', () => {
  let component: SizeFilterComponent;
  let fixture: ComponentFixture<SizeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizeFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
