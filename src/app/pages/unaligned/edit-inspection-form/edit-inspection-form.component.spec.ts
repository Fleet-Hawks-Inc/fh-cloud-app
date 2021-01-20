import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInspectionFormComponent } from './edit-inspection-form.component';

describe('EditInspectionFormComponent', () => {
  let component: EditInspectionFormComponent;
  let fixture: ComponentFixture<EditInspectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInspectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInspectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
