import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTransactionsComponent } from './expense-transactions.component';

describe('ExpenseTransactionsComponent', () => {
  let component: ExpenseTransactionsComponent;
  let fixture: ComponentFixture<ExpenseTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
