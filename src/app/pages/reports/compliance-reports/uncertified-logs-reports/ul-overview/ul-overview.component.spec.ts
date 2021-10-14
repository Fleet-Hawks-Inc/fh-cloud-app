import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UlOverviewComponent } from './ul-overview.component';

describe('UlOverviewComponent', () => {
  let component: UlOverviewComponent;
  let fixture: ComponentFixture<UlOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UlOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
