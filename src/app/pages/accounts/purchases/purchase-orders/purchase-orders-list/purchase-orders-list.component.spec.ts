import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersListComponent } from './purchase-orders-list.component';

describe('PurchaseOrdersListComponent', () => {
  let component: PurchaseOrdersListComponent;
  let fixture: ComponentFixture<PurchaseOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
