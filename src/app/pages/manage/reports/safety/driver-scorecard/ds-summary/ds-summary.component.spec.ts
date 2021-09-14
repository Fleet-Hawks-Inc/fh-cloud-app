import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DsSummaryComponent } from './ds-summary.component';

describe('DsSummaryComponent', () => {
  let component: DsSummaryComponent;
  let fixture: ComponentFixture<DsSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
