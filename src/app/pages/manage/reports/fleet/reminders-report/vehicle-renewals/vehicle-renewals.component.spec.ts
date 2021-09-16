import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VehicleRenewalsComponent } from './vehicle-renewals.component';

describe('VehicleRenewalsComponent', () => {
  let component: VehicleRenewalsComponent;
  let fixture: ComponentFixture<VehicleRenewalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
