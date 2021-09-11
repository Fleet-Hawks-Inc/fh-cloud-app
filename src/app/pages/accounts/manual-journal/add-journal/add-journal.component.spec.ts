import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddJournalComponent } from './add-journal.component';

describe('AddJournalComponent', () => {
  let component: AddJournalComponent;
  let fixture: ComponentFixture<AddJournalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
