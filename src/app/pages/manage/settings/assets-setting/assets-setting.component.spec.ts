import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetsSettingComponent } from './assets-setting.component';

describe('AssetsSettingComponent', () => {
  let component: AssetsSettingComponent;
  let fixture: ComponentFixture<AssetsSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
