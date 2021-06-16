import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverLogsComponent } from './driver-logs.component';

describe('DriverLogsComponent', () => {
  let component: DriverLogsComponent;
  let fixture: ComponentFixture<DriverLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
