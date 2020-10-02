import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRenewDetailComponent } from './vehicle-renew-detail.component';

describe('VehicleRenewDetailComponent', () => {
  let component: VehicleRenewDetailComponent;
  let fixture: ComponentFixture<VehicleRenewDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRenewDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRenewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
