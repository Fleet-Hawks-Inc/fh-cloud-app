import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceProgramDetailComponent } from './service-program-detail.component';

describe('ServiceProgramDetailComponent', () => {
  let component: ServiceProgramDetailComponent;
  let fixture: ComponentFixture<ServiceProgramDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProgramDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProgramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
