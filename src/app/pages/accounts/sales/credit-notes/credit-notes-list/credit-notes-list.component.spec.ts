import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditNotesListComponent } from './credit-notes-list.component';

describe('CreditNotesListComponent', () => {
  let component: CreditNotesListComponent;
  let fixture: ComponentFixture<CreditNotesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditNotesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
