import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SremindersComponent } from './sreminders.component';

describe('SremindersComponent', () => {
  let component: SremindersComponent;
  let fixture: ComponentFixture<SremindersComponent>;

  beforeEach(async(() => {
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
