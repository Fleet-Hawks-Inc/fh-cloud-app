import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CashFlowStatementComponent } from './cash-flow-statement.component';

describe('CashFlowStatementComponent', () => {
  let component: CashFlowStatementComponent;
  let fixture: ComponentFixture<CashFlowStatementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFlowStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
