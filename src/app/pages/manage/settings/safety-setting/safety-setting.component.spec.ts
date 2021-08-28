import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetySettingComponent } from './safety-setting.component';

describe('SafetySettingComponent', () => {
  let component: SafetySettingComponent;
  let fixture: ComponentFixture<SafetySettingComponent>;

  beforeEach(async(() => {
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
