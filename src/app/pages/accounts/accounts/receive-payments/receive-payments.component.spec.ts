import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePaymentsComponent } from './receive-payments.component';

describe('ReceivePaymentsComponent', () => {
  let component: ReceivePaymentsComponent;
  let fixture: ComponentFixture<ReceivePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
