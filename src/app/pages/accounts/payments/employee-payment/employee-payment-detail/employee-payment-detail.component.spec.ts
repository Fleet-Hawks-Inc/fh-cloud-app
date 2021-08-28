import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePaymentDetailComponent } from './employee-payment-detail.component';

describe('EmployeePaymentDetailComponent', () => {
  let component: EmployeePaymentDetailComponent;
  let fixture: ComponentFixture<EmployeePaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
