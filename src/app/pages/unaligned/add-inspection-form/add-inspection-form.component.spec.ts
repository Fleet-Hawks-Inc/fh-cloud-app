import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInspectionFormComponent } from './add-inspection-form.component';

describe('AddInspectionFormComponent', () => {
  let component: AddInspectionFormComponent;
  let fixture: ComponentFixture<AddInspectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInspectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInspectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
