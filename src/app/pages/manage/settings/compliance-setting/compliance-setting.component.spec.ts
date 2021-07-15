import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceSettingComponent } from './compliance-setting.component';

describe('ComplianceSettingComponent', () => {
  let component: ComplianceSettingComponent;
  let fixture: ComponentFixture<ComplianceSettingComponent>;

  beforeEach(async(() => {
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
