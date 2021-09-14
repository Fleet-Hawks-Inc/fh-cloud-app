import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeePaymentListComponent } from './employee-payment-list.component';

describe('EmployeePaymentListComponent', () => {
  let component: EmployeePaymentListComponent;
  let fixture: ComponentFixture<EmployeePaymentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
