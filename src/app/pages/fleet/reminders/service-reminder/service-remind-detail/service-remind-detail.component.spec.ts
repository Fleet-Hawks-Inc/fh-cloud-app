import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRemindDetailComponent } from './service-remind-detail.component';

describe('ServiceRemindDetailComponent', () => {
  let component: ServiceRemindDetailComponent;
  let fixture: ComponentFixture<ServiceRemindDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRemindDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRemindDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
