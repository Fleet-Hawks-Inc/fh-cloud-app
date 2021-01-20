import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiallyPaidInvoicesComponent } from './partially-paid-invoices.component';

describe('PartiallyPaidInvoicesComponent', () => {
  let component: PartiallyPaidInvoicesComponent;
  let fixture: ComponentFixture<PartiallyPaidInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiallyPaidInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartiallyPaidInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
