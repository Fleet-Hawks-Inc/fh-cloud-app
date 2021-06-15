import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesReceiptsComponent } from './add-sales-receipts.component';

describe('AddSalesReceiptsComponent', () => {
  let component: AddSalesReceiptsComponent;
  let fixture: ComponentFixture<AddSalesReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
