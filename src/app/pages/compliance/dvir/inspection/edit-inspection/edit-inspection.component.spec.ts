import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInspectionComponent } from './edit-inspection.component';

describe('EditInspectionComponent', () => {
  let component: EditInspectionComponent;
  let fixture: ComponentFixture<EditInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
