import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendorCreditNotesListComponent } from './vendor-credit-notes-list.component';

describe('VendorCreditNotesListComponent', () => {
  let component: VendorCreditNotesListComponent;
  let fixture: ComponentFixture<VendorCreditNotesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCreditNotesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCreditNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
