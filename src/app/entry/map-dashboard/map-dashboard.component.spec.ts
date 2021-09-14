import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapDashboardComponent } from './map-dashboard.component';

describe('MapDashboardComponent', () => {
  let component: MapDashboardComponent;
  let fixture: ComponentFixture<MapDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
