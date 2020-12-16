import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTransactionDetailComponent } from './income-transaction-detail.component';

describe('IncomeTransactionDetailComponent', () => {
  let component: IncomeTransactionDetailComponent;
  let fixture: ComponentFixture<IncomeTransactionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
