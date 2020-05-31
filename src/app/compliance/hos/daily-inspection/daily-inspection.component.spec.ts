import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInspectionComponent } from './daily-inspection.component';

describe('DailyInspectionComponent', () => {
  let component: DailyInspectionComponent;
  let fixture: ComponentFixture<DailyInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
