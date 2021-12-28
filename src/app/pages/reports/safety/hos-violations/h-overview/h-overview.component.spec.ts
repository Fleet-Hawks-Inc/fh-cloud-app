import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HOverviewComponent } from './h-overview.component';

describe('HOverviewComponent', () => {
  let component: HOverviewComponent;
  let fixture: ComponentFixture<HOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
