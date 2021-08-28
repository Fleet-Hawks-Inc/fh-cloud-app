import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChequeComponent } from './payment-cheque.component';

describe('PaymentChequeComponent', () => {
  let component: PaymentChequeComponent;
  let fixture: ComponentFixture<PaymentChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
