import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDeductionsComponent } from './recurring-deductions.component';

describe('RecurringDeductionsComponent', () => {
  let component: RecurringDeductionsComponent;
  let fixture: ComponentFixture<RecurringDeductionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringDeductionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
