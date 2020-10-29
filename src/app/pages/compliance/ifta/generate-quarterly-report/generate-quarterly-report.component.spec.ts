import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQuarterlyReportComponent } from './generate-quarterly-report.component';

describe('GenerateQuarterlyReportComponent', () => {
  let component: GenerateQuarterlyReportComponent;
  let fixture: ComponentFixture<GenerateQuarterlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateQuarterlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateQuarterlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
