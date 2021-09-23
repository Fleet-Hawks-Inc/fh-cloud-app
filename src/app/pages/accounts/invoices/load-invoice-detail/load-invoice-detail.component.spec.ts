import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadInvoiceDetailComponent } from './load-invoice-detail.component';

describe('LoadInvoiceDetailComponent', () => {
  let component: LoadInvoiceDetailComponent;
  let fixture: ComponentFixture<LoadInvoiceDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadInvoiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
