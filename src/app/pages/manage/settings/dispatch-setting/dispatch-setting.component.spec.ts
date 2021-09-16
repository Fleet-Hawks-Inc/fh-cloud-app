import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DispatchSettingComponent } from './dispatch-setting.component';

describe('DispatchSettingComponent', () => {
  let component: DispatchSettingComponent;
  let fixture: ComponentFixture<DispatchSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
