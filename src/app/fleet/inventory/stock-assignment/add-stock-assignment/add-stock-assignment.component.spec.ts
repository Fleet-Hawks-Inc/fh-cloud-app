import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockAssignmentComponent } from './add-stock-assignment.component';

describe('AddStockAssignmentComponent', () => {
  let component: AddStockAssignmentComponent;
  let fixture: ComponentFixture<AddStockAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStockAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
