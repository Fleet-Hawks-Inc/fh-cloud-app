import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarrierComponent } from './add-carrier.component';

describe('AddCarrierComponent', () => {
  let component: AddCarrierComponent;
  let fixture: ComponentFixture<AddCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
