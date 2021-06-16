import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentsDetailComponent } from './advance-payments-detail.component';

describe('AdvancePaymentsDetailComponent', () => {
  let component: AdvancePaymentsDetailComponent;
  let fixture: ComponentFixture<AdvancePaymentsDetailComponent>;

  beforeEach(async(() => {
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
