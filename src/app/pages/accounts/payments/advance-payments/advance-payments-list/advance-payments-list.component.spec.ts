import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePaymentsListComponent } from './advance-payments-list.component';

describe('AdvancePaymentsListComponent', () => {
  let component: AdvancePaymentsListComponent;
  let fixture: ComponentFixture<AdvancePaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancePaymentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancePaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
