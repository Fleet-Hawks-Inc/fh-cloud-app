import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierRegistrationComponent } from './carrier-registration.component';

describe('CarrierRegistrationComponent', () => {
  let component: CarrierRegistrationComponent;
  let fixture: ComponentFixture<CarrierRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
