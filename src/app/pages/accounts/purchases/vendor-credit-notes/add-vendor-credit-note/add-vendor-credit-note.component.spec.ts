import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorCreditNoteComponent } from './add-vendor-credit-note.component';

describe('AddVendorCreditNoteComponent', () => {
  let component: AddVendorCreditNoteComponent;
  let fixture: ComponentFixture<AddVendorCreditNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVendorCreditNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
