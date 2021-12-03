import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverReportComponent } from './driver-report.component';

describe('DriverReportComponent', () => {
  let component: DriverReportComponent;
  let fixture: ComponentFixture<DriverReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverReportComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
