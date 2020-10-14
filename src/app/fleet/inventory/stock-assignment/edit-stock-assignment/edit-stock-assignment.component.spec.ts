import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockAssignmentComponent } from './edit-stock-assignment.component';

describe('EditStockAssignmentComponent', () => {
  let component: EditStockAssignmentComponent;
  let fixture: ComponentFixture<EditStockAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStockAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
