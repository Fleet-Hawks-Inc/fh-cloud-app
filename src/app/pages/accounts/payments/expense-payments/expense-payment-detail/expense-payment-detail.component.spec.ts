import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePaymentDetailComponent } from './expense-payment-detail.component';

describe('ExpensePaymentDetailComponent', () => {
  let component: ExpensePaymentDetailComponent;
  let fixture: ComponentFixture<ExpensePaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensePaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
