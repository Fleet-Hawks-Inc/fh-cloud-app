import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UlSummaryComponent } from './ul-summary.component';

describe('UlSummaryComponent', () => {
  let component: UlSummaryComponent;
  let fixture: ComponentFixture<UlSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UlSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
