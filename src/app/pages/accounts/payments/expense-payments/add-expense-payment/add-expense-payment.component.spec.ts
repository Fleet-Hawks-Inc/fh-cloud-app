import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpensePaymentComponent } from './add-expense-payment.component';

describe('AddExpensePaymentComponent', () => {
  let component: AddExpensePaymentComponent;
  let fixture: ComponentFixture<AddExpensePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpensePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpensePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
