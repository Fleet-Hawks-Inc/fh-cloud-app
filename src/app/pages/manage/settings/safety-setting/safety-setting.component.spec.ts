import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafetySettingComponent } from './safety-setting.component';

describe('SafetySettingComponent', () => {
  let component: SafetySettingComponent;
  let fixture: ComponentFixture<SafetySettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
