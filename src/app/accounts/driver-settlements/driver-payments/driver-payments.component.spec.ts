import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPaymentsComponent } from './driver-payments.component';

describe('DriverPaymentsComponent', () => {
  let component: DriverPaymentsComponent;
  let fixture: ComponentFixture<DriverPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
