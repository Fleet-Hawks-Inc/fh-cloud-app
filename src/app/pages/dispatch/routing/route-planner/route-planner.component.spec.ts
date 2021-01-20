import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlannerComponent } from './route-planner.component';

describe('RoutePlannerComponent', () => {
  let component: RoutePlannerComponent;
  let fixture: ComponentFixture<RoutePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
