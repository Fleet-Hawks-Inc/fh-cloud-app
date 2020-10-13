import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleServiceLogsComponent } from './vehicle-service-logs.component';

describe('VehicleServiceLogsComponent', () => {
  let component: VehicleServiceLogsComponent;
  let fixture: ComponentFixture<VehicleServiceLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleServiceLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleServiceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
