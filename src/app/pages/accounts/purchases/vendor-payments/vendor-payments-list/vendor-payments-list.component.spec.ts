import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPaymentsListComponent } from './vendor-payments-list.component';

describe('VendorPaymentsListComponent', () => {
  let component: VendorPaymentsListComponent;
  let fixture: ComponentFixture<VendorPaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPaymentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
