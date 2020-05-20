import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperAddressListComponent } from './shipper-address-list.component';

describe('ShipperAddressListComponent', () => {
  let component: ShipperAddressListComponent;
  let fixture: ComponentFixture<ShipperAddressListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipperAddressListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipperAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
