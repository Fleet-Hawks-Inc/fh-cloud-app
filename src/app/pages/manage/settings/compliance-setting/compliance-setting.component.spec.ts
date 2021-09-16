import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComplianceSettingComponent } from './compliance-setting.component';

describe('ComplianceSettingComponent', () => {
  let component: ComplianceSettingComponent;
  let fixture: ComponentFixture<ComplianceSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
