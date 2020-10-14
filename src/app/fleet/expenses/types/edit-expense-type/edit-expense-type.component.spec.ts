import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpenseTypeComponent } from './edit-expense-type.component';

describe('EditExpenseTypeComponent', () => {
  let component: EditExpenseTypeComponent;
  let fixture: ComponentFixture<EditExpenseTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExpenseTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpenseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
