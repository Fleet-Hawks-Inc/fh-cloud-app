import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSettingComponent } from './driver-setting.component';

describe('DriverSettingComponent', () => {
  let component: DriverSettingComponent;
  let fixture: ComponentFixture<DriverSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
