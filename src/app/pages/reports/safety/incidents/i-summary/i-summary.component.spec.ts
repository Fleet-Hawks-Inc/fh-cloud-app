import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ISummaryComponent } from './i-summary.component';

describe('ISummaryComponent', () => {
  let component: ISummaryComponent;
  let fixture: ComponentFixture<ISummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ISummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ISummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
