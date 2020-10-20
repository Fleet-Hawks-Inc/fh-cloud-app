import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IftaReportHistoryComponent } from './ifta-report-history.component';

describe('IftaReportHistoryComponent', () => {
  let component: IftaReportHistoryComponent;
  let fixture: ComponentFixture<IftaReportHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IftaReportHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IftaReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
