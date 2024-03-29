import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriverPaymentsListComponent } from './driver-payments-list.component';

describe('DriverPaymentsListComponent', () => {
  let component: DriverPaymentsListComponent;
  let fixture: ComponentFixture<DriverPaymentsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPaymentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
