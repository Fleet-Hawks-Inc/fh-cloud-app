import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAssignmentListComponent } from './stock-assignment-list.component';

describe('StockAssignmentListComponent', () => {
  let component: StockAssignmentListComponent;
  let fixture: ComponentFixture<StockAssignmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAssignmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
