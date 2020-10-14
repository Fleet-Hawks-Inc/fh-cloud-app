import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyInspectionComponent } from './add-daily-inspection.component';

describe('AddDailyInspectionComponent', () => {
  let component: AddDailyInspectionComponent;
  let fixture: ComponentFixture<AddDailyInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDailyInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDailyInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
