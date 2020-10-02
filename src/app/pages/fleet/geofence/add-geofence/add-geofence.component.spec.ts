import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeofenceComponent } from './add-geofence.component';

describe('AddGeofenceComponent', () => {
  let component: AddGeofenceComponent;
  let fixture: ComponentFixture<AddGeofenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGeofenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeofenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
