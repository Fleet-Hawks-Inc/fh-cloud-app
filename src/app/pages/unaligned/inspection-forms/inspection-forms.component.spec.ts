import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionFormsComponent } from './inspection-forms.component';

describe('InspectionFormsComponent', () => {
  let component: InspectionFormsComponent;
  let fixture: ComponentFixture<InspectionFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
