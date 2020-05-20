import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceiverAddressComponent } from './edit-receiver-address.component';

describe('EditReceiverAddressComponent', () => {
  let component: EditReceiverAddressComponent;
  let fixture: ComponentFixture<EditReceiverAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReceiverAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReceiverAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
