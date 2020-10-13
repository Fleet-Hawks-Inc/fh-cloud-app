import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchPlannerComponent } from './dispatch-planner.component';

describe('DispatchPlannerComponent', () => {
  let component: DispatchPlannerComponent;
  let fixture: ComponentFixture<DispatchPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
