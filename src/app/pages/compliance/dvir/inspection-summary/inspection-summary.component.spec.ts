import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InspectionSummaryComponent } from './inspection-summary.component';

describe('InspectionSummaryComponent', () => {
  let component: InspectionSummaryComponent;
  let fixture: ComponentFixture<InspectionSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
