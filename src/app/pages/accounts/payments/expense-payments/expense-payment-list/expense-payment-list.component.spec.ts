import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensePaymentListComponent } from './expense-payment-list.component';

describe('ExpensePaymentListComponent', () => {
  let component: ExpensePaymentListComponent;
  let fixture: ComponentFixture<ExpensePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensePaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
