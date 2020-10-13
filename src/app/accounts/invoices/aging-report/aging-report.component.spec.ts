import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingReportComponent } from './aging-report.component';

describe('AgingReportComponent', () => {
  let component: AgingReportComponent;
  let fixture: ComponentFixture<AgingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
