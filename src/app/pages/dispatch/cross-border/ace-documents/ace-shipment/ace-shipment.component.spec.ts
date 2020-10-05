import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AceShipmentComponent } from './ace-shipment.component';

describe('AceShipmentComponent', () => {
  let component: AceShipmentComponent;
  let fixture: ComponentFixture<AceShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AceShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AceShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
