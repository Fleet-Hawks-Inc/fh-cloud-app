import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceprogramComponent } from './serviceprogram.component';

describe('ServiceprogramComponent', () => {
  let component: ServiceprogramComponent;
  let fixture: ComponentFixture<ServiceprogramComponent>;

  beforeEach(async(() => {
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
