import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosChartComponent } from './hos-chart.component';

describe('HosChartComponent', () => {
  let component: HosChartComponent;
  let fixture: ComponentFixture<HosChartComponent>;

  beforeEach(async(() => {
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
