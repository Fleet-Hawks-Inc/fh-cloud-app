import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlaybackComponent } from './route-playback.component';

describe('RoutePlaybackComponent', () => {
  let component: RoutePlaybackComponent;
  let fixture: ComponentFixture<RoutePlaybackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutePlaybackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
