import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorCreditNoteDetailComponent } from './vendor-credit-note-detail.component';

describe('VendorCreditNoteDetailComponent', () => {
  let component: VendorCreditNoteDetailComponent;
  let fixture: ComponentFixture<VendorCreditNoteDetailComponent>;

  beforeEach(waitForAsync(() => {
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
