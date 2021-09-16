import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HosOverviewComponent } from './hos-overview.component';

describe('HosOverviewComponent', () => {
  let component: HosOverviewComponent;
  let fixture: ComponentFixture<HosOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HosOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
