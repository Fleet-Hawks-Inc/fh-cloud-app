import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleServiceLogComponent } from './add-vehicle-service-log.component';

describe('AddVehicleServiceLogComponent', () => {
  let component: AddVehicleServiceLogComponent;
  let fixture: ComponentFixture<AddVehicleServiceLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVehicleServiceLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVehicleServiceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
