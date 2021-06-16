import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesOrderComponent } from './add-sales-order.component';

describe('AddSalesOrderComponent', () => {
  let component: AddSalesOrderComponent;
  let fixture: ComponentFixture<AddSalesOrderComponent>;

  beforeEach(async(() => {
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
