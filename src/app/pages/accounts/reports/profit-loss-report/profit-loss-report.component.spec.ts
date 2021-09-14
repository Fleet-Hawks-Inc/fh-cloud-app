import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfitLossReportComponent } from './profit-loss-report.component';

describe('ProfitLossReportComponent', () => {
  let component: ProfitLossReportComponent;
  let fixture: ComponentFixture<ProfitLossReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitLossReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
