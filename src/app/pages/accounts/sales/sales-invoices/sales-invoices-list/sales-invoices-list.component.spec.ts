import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalesInvoicesListComponent } from './sales-invoices-list.component';

describe('SalesInvoicesListComponent', () => {
  let component: SalesInvoicesListComponent;
  let fixture: ComponentFixture<SalesInvoicesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesInvoicesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
