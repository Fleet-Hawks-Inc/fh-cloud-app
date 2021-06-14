import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRenewalsComponent } from './vehicle-renewals.component';

describe('VehicleRenewalsComponent', () => {
  let component: VehicleRenewalsComponent;
  let fixture: ComponentFixture<VehicleRenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
