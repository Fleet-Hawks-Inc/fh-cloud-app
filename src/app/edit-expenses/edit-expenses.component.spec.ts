import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpensesComponent } from './edit-expenses.component';

describe('EditExpensesComponent', () => {
  let component: EditExpensesComponent;
  let fixture: ComponentFixture<EditExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
