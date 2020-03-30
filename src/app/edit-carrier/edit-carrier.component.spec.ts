import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarrierComponent } from './edit-carrier.component';

describe('EditCarrierComponent', () => {
  let component: EditCarrierComponent;
  let fixture: ComponentFixture<EditCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
