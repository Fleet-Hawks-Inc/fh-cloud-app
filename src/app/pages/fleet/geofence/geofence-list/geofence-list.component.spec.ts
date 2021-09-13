import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeofenceListComponent } from './geofence-list.component';

describe('GeofenceListComponent', () => {
  let component: GeofenceListComponent;
  let fixture: ComponentFixture<GeofenceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
