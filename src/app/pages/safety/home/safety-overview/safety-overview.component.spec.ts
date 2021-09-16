import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafetyOverviewComponent } from './safety-overview.component';

describe('SafetyOverviewComponent', () => {
  let component: SafetyOverviewComponent;
  let fixture: ComponentFixture<SafetyOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
