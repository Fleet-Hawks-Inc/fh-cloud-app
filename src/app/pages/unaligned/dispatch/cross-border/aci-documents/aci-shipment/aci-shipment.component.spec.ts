import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AciShipmentComponent } from './aci-shipment.component';

describe('AciShipmentComponent', () => {
  let component: AciShipmentComponent;
  let fixture: ComponentFixture<AciShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AciShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AciShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
