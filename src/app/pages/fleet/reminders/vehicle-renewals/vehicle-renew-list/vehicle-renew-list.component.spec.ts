import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VehicleRenewListComponent } from './vehicle-renew-list.component';

describe('VehicleRenewListComponent', () => {
  let component: VehicleRenewListComponent;
  let fixture: ComponentFixture<VehicleRenewListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRenewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRenewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
