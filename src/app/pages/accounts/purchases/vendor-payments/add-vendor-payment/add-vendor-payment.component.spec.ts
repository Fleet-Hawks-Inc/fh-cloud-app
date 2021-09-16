import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddVendorPaymentComponent } from './add-vendor-payment.component';

describe('AddVendorPaymentComponent', () => {
  let component: AddVendorPaymentComponent;
  let fixture: ComponentFixture<AddVendorPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVendorPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
