import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriverDetailComponent } from './driver-detail.component';

describe('DriverDetailComponent', () => {
  let component: DriverDetailComponent;
  let fixture: ComponentFixture<DriverDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
