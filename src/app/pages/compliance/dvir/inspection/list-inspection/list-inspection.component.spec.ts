import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListInspectionComponent } from './list-inspection.component';

describe('ListInspectionComponent', () => {
  let component: ListInspectionComponent;
  let fixture: ComponentFixture<ListInspectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
