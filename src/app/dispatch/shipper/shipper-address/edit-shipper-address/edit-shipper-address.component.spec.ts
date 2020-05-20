import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShipperAddressComponent } from './edit-shipper-address.component';

describe('EditShipperAddressComponent', () => {
  let component: EditShipperAddressComponent;
  let fixture: ComponentFixture<EditShipperAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShipperAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShipperAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
