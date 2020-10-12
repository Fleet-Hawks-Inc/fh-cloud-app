import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDailyInspectionComponent } from './edit-daily-inspection.component';

describe('EditDailyInspectionComponent', () => {
  let component: EditDailyInspectionComponent;
  let fixture: ComponentFixture<EditDailyInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDailyInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDailyInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
