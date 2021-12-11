import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerSettingComponent } from './customer-setting.component';

describe('CustomerSettingComponent', () => {
  let component: CustomerSettingComponent;
  let fixture: ComponentFixture<CustomerSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
