import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoadInvoiceComponent } from './add-load-invoice.component';

describe('AddLoadInvoiceComponent', () => {
  let component: AddLoadInvoiceComponent;
  let fixture: ComponentFixture<AddLoadInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLoadInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoadInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
