import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvancePaymentsDetailComponent } from './advance-payments-detail.component';

describe('AdvancePaymentsDetailComponent', () => {
  let component: AdvancePaymentsDetailComponent;
  let fixture: ComponentFixture<AdvancePaymentsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePaymentsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
