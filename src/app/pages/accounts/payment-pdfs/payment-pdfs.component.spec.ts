import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPdfsComponent } from './payment-pdfs.component';

describe('PaymentPdfsComponent', () => {
  let component: PaymentPdfsComponent;
  let fixture: ComponentFixture<PaymentPdfsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPdfsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
