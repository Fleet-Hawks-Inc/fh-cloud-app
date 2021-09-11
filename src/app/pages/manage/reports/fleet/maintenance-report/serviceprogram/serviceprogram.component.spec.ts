import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceprogramComponent } from './serviceprogram.component';

describe('ServiceprogramComponent', () => {
  let component: ServiceprogramComponent;
  let fixture: ComponentFixture<ServiceprogramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceprogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceprogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
