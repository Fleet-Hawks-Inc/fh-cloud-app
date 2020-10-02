import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRenewAddComponent } from './vehicle-renew-add.component';

describe('VehicleRenewAddComponent', () => {
  let component: VehicleRenewAddComponent;
  let fixture: ComponentFixture<VehicleRenewAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRenewAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRenewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
