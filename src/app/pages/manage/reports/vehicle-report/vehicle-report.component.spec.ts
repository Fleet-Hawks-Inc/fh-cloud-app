import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleReportComponent } from './vehicle-report.component';

describe('VehicleReportComponent', () => {
  let component: VehicleReportComponent;
  let fixture: ComponentFixture<VehicleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
