import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriverPaymentsDetailComponent } from './driver-payments-detail.component';

describe('DriverPaymentsDetailComponent', () => {
  let component: DriverPaymentsDetailComponent;
  let fixture: ComponentFixture<DriverPaymentsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPaymentsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPaymentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
