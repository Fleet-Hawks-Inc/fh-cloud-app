import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InspectionformComponent } from './inspectionform.component';

describe('InspectionformComponent', () => {
  let component: InspectionformComponent;
  let fixture: ComponentFixture<InspectionformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
