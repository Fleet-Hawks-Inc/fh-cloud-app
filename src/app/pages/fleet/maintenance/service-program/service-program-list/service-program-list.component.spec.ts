import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceProgramListComponent } from './service-program-list.component';

describe('ServiceProgramListComponent', () => {
  let component: ServiceProgramListComponent;
  let fixture: ComponentFixture<ServiceProgramListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProgramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
