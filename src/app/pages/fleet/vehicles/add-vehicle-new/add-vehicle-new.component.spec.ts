import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddVehicleNewComponent } from './add-vehicle-new.component';

describe('AddVehicleNewComponent', () => {
  let component: AddVehicleNewComponent;
  let fixture: ComponentFixture<AddVehicleNewComponent>;

  beforeEach(waitForAsync(() => {
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
