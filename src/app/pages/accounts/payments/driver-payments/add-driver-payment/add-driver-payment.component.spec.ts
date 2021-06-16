import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverPaymentComponent } from './add-driver-payment.component';

describe('AddDriverPaymentComponent', () => {
  let component: AddDriverPaymentComponent;
  let fixture: ComponentFixture<AddDriverPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDriverPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDriverPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
