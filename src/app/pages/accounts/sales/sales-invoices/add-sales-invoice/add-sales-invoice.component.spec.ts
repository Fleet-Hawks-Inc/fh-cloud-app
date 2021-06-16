import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesInvoiceComponent } from './add-sales-invoice.component';

describe('AddSalesInvoiceComponent', () => {
  let component: AddSalesInvoiceComponent;
  let fixture: ComponentFixture<AddSalesInvoiceComponent>;

  beforeEach(async(() => {
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
