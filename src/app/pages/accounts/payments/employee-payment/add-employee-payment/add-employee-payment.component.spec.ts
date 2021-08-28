import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeePaymentComponent } from './add-employee-payment.component';

describe('AddEmployeePaymentComponent', () => {
  let component: AddEmployeePaymentComponent;
  let fixture: ComponentFixture<AddEmployeePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
