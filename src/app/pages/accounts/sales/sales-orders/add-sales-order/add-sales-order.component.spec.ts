import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSalesOrderComponent } from './add-sales-order.component';

describe('AddSalesOrderComponent', () => {
  let component: AddSalesOrderComponent;
  let fixture: ComponentFixture<AddSalesOrderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
