import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVehicleNewComponent } from './edit-vehicle-new.component';

describe('EditVehicleNewComponent', () => {
  let component: EditVehicleNewComponent;
  let fixture: ComponentFixture<EditVehicleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVehicleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVehicleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
