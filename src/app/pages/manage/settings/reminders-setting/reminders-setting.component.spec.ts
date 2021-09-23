import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemindersSettingComponent } from './reminders-setting.component';

describe('RemindersSettingComponent', () => {
  let component: RemindersSettingComponent;
  let fixture: ComponentFixture<RemindersSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindersSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindersSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
