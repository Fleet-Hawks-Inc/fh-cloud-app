import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewInspectionComponent } from './view-inspection.component';

describe('ViewInspectionComponent', () => {
  let component: ViewInspectionComponent;
  let fixture: ComponentFixture<ViewInspectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
