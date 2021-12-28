import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripsDetailComponent } from './trips-detail.component';

describe('TripsDetailComponent', () => {
  let component: TripsDetailComponent;
  let fixture: ComponentFixture<TripsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
