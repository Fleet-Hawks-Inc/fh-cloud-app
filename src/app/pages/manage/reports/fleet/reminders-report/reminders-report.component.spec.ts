import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersReportComponent } from './reminders-report.component';

describe('RemindersReportComponent', () => {
  let component: RemindersReportComponent;
  let fixture: ComponentFixture<RemindersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
