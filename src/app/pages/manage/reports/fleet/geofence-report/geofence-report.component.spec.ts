import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceReportComponent } from './geofence-report.component';

describe('GeofenceReportComponent', () => {
  let component: GeofenceReportComponent;
  let fixture: ComponentFixture<GeofenceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofenceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
