import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceVendorListComponent } from './service-vendor-list.component';

describe('ServiceVendorListComponent', () => {
  let component: ServiceVendorListComponent;
  let fixture: ComponentFixture<ServiceVendorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceVendorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
