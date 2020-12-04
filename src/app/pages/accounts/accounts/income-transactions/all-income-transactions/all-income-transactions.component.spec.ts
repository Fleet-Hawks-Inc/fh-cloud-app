import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncomeTransactionsComponent } from './all-income-transactions.component';

describe('AllIncomeTransactionsComponent', () => {
  let component: AllIncomeTransactionsComponent;
  let fixture: ComponentFixture<AllIncomeTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllIncomeTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIncomeTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
