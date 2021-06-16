import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSummaryComponent } from './driver-summary.component';

describe('DriverSummaryComponent', () => {
  let component: DriverSummaryComponent;
  let fixture: ComponentFixture<DriverSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
