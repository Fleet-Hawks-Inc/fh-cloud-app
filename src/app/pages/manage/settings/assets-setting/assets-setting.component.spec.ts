import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsSettingComponent } from './assets-setting.component';

describe('AssetsSettingComponent', () => {
  let component: AssetsSettingComponent;
  let fixture: ComponentFixture<AssetsSettingComponent>;

  beforeEach(async(() => {
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
