import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesReportComponent } from './issues-report.component';

describe('IssuesReportComponent', () => {
  let component: IssuesReportComponent;
  let fixture: ComponentFixture<IssuesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
