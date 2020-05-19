import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFuelEntryComponent } from './edit-fuel-entry.component';

describe('EditFuelEntryComponent', () => {
  let component: EditFuelEntryComponent;
  let fixture: ComponentFixture<EditFuelEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFuelEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFuelEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
