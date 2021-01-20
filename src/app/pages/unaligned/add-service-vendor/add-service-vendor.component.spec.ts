import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceVendorComponent } from './add-service-vendor.component';

describe('AddServiceVendorComponent', () => {
  let component: AddServiceVendorComponent;
  let fixture: ComponentFixture<AddServiceVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServiceVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
