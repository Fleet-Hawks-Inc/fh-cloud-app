import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailedInvoicesComponent } from './emailed-invoices.component';

describe('EmailedInvoicesComponent', () => {
  let component: EmailedInvoicesComponent;
  let fixture: ComponentFixture<EmailedInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailedInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailedInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
