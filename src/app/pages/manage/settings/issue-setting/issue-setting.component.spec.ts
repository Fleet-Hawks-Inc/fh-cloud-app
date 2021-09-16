import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IssueSettingComponent } from './issue-setting.component';

describe('IssueSettingComponent', () => {
  let component: IssueSettingComponent;
  let fixture: ComponentFixture<IssueSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
