import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SremindersComponent } from './sreminders.component';

describe('SremindersComponent', () => {
  let component: SremindersComponent;
  let fixture: ComponentFixture<SremindersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SremindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SremindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
