import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiceVendorComponent } from './edit-service-vendor.component';

describe('EditServiceVendorComponent', () => {
  let component: EditServiceVendorComponent;
  let fixture: ComponentFixture<EditServiceVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServiceVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiceVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
