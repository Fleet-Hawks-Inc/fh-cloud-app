import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInspectionListComponent } from './daily-inspection-list.component';

describe('DailyInspectionListComponent', () => {
  let component: DailyInspectionListComponent;
  let fixture: ComponentFixture<DailyInspectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyInspectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyInspectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
