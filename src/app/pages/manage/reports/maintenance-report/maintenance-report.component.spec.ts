import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceReportComponent } from './maintenance-report.component';

describe('MaintenanceReportComponent', () => {
  let component: MaintenanceReportComponent;
  let fixture: ComponentFixture<MaintenanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
