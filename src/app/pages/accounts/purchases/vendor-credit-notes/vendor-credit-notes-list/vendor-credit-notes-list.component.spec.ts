import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreditNotesListComponent } from './vendor-credit-notes-list.component';

describe('VendorCreditNotesListComponent', () => {
  let component: VendorCreditNotesListComponent;
  let fixture: ComponentFixture<VendorCreditNotesListComponent>;

  beforeEach(async(() => {
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
