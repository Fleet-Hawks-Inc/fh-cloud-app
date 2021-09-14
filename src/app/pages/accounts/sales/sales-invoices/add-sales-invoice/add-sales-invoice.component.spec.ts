import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSalesInvoiceComponent } from './add-sales-invoice.component';

describe('AddSalesInvoiceComponent', () => {
  let component: AddSalesInvoiceComponent;
  let fixture: ComponentFixture<AddSalesInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
