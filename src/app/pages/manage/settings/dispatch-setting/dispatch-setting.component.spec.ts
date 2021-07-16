import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSettingComponent } from './dispatch-setting.component';

describe('DispatchSettingComponent', () => {
  let component: DispatchSettingComponent;
  let fixture: ComponentFixture<DispatchSettingComponent>;

  beforeEach(async(() => {
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
