import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesInvoiceDetailComponent } from './sales-invoice-detail.component';

describe('SalesInvoiceDetailComponent', () => {
  let component: SalesInvoiceDetailComponent;
  let fixture: ComponentFixture<SalesInvoiceDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesInvoiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
