import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidedInvoicesComponent } from './voided-invoices.component';

describe('VoidedInvoicesComponent', () => {
  let component: VoidedInvoicesComponent;
  let fixture: ComponentFixture<VoidedInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoidedInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidedInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
