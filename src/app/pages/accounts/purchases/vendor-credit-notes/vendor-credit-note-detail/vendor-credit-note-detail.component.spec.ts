import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreditNoteDetailComponent } from './vendor-credit-note-detail.component';

describe('VendorCreditNoteDetailComponent', () => {
  let component: VendorCreditNoteDetailComponent;
  let fixture: ComponentFixture<VendorCreditNoteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCreditNoteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCreditNoteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
