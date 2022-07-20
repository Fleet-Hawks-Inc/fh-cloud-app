import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDashCamTrackerComponent } from './vehicle-dash-cam-tracker.component';

describe('VehicleDashCamTrackerComponent', () => {
  let component: VehicleDashCamTrackerComponent;
  let fixture: ComponentFixture<VehicleDashCamTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDashCamTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDashCamTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
