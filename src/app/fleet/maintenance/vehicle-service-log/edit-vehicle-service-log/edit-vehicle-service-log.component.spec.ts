import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVehicleServiceLogComponent } from './edit-vehicle-service-log.component';

describe('EditVehicleServiceLogComponent', () => {
  let component: EditVehicleServiceLogComponent;
  let fixture: ComponentFixture<EditVehicleServiceLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVehicleServiceLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVehicleServiceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
