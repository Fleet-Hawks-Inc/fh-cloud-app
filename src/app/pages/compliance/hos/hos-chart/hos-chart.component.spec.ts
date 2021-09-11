import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HosChartComponent } from './hos-chart.component';

describe('HosChartComponent', () => {
  let component: HosChartComponent;
  let fixture: ComponentFixture<HosChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HosChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
