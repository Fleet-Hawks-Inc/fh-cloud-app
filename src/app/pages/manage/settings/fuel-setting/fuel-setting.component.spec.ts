import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FuelSettingComponent } from './fuel-setting.component';

describe('FuelSettingComponent', () => {
  let component: FuelSettingComponent;
  let fixture: ComponentFixture<FuelSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
