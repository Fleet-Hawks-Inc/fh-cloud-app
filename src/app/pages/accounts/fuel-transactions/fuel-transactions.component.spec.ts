import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTransactionsComponent } from './fuel-transactions.component';

describe('FuelTransactionsComponent', () => {
  let component: FuelTransactionsComponent;
  let fixture: ComponentFixture<FuelTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
