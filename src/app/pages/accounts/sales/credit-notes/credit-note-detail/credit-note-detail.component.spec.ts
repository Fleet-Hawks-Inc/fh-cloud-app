import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteDetailComponent } from './credit-note-detail.component';

describe('CreditNoteDetailComponent', () => {
  let component: CreditNoteDetailComponent;
  let fixture: ComponentFixture<CreditNoteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditNoteDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
