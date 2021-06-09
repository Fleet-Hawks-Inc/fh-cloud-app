import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelReportComponent } from './fuel-report.component';

describe('FuelReportComponent', () => {
  let component: FuelReportComponent;
  let fixture: ComponentFixture<FuelReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
