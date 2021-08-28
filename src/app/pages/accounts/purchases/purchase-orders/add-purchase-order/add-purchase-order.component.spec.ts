import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseOrderComponent } from './add-purchase-order.component';

describe('AddPurchaseOrderComponent', () => {
  let component: AddPurchaseOrderComponent;
  let fixture: ComponentFixture<AddPurchaseOrderComponent>;

  beforeEach(async(() => {
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
