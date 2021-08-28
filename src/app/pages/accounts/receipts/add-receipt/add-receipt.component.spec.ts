import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceiptComponent } from './add-receipt.component';

describe('AddReceiptComponent', () => {
  let component: AddReceiptComponent;
  let fixture: ComponentFixture<AddReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
