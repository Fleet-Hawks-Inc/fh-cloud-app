import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPurchaseOrderComponent } from './add-purchase-order.component';

describe('AddPurchaseOrderComponent', () => {
  let component: AddPurchaseOrderComponent;
  let fixture: ComponentFixture<AddPurchaseOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
