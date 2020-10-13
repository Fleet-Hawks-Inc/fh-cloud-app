import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShipperComponent } from './add-shipper.component';

describe('AddShipperComponent', () => {
  let component: AddShipperComponent;
  let fixture: ComponentFixture<AddShipperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShipperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShipperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
