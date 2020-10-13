import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleNewComponent } from './add-vehicle-new.component';

describe('AddVehicleNewComponent', () => {
  let component: AddVehicleNewComponent;
  let fixture: ComponentFixture<AddVehicleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVehicleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
