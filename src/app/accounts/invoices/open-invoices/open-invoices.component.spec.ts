import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenInvoicesComponent } from './open-invoices.component';

describe('OpenInvoicesComponent', () => {
  let component: OpenInvoicesComponent;
  let fixture: ComponentFixture<OpenInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
