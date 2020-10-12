import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBoardComponent } from './load-board.component';

describe('LoadBoardComponent', () => {
  let component: LoadBoardComponent;
  let fixture: ComponentFixture<LoadBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
