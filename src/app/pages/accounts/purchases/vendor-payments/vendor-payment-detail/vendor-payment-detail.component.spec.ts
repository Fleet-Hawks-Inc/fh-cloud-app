import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPaymentDetailComponent } from './vendor-payment-detail.component';

describe('VendorPaymentDetailComponent', () => {
  let component: VendorPaymentDetailComponent;
  let fixture: ComponentFixture<VendorPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
