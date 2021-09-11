import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddFuelEntryComponent } from './add-fuel-entry.component';

describe('AddFuelEntryComponent', () => {
  let component: AddFuelEntryComponent;
  let fixture: ComponentFixture<AddFuelEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
