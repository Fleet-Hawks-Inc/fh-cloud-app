import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierRegisterComponent } from './carrier-register.component';

describe('CarrierRegisterComponent', () => {
  let component: CarrierRegisterComponent;
  let fixture: ComponentFixture<CarrierRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
