import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCreditNoteComponent } from './add-credit-note.component';

describe('AddCreditNoteComponent', () => {
  let component: AddCreditNoteComponent;
  let fixture: ComponentFixture<AddCreditNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCreditNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
