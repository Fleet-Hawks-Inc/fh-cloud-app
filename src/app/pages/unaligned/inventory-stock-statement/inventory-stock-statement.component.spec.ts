import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockStatementComponent } from './inventory-stock-statement.component';

describe('InventoryStockStatementComponent', () => {
  let component: InventoryStockStatementComponent;
  let fixture: ComponentFixture<InventoryStockStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryStockStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStockStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
