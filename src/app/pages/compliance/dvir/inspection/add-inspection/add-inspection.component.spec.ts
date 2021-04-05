import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInspectionComponent } from './add-inspection.component';

describe('AddInspectionComponent', () => {
  let component: AddInspectionComponent;
  let fixture: ComponentFixture<AddInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
