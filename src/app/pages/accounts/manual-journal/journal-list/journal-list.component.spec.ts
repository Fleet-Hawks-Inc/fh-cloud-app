import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JournalListComponent } from './journal-list.component';

describe('JournalListComponent', () => {
  let component: JournalListComponent;
  let fixture: ComponentFixture<JournalListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
