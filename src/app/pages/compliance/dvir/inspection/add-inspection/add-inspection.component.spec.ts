import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddInspectionComponent } from './add-inspection.component';

describe('AddInspectionComponent', () => {
  let component: AddInspectionComponent;
  let fixture: ComponentFixture<AddInspectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
