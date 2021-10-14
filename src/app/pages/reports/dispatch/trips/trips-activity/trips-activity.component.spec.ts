import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripsActivityComponent } from './trips-activity.component';

describe('TripsActivityComponent', () => {
  let component: TripsActivityComponent;
  let fixture: ComponentFixture<TripsActivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripsActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
