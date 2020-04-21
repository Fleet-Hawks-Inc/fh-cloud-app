import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManufacturerComponent } from './edit-manufacturer.component';

describe('EditManufacturerComponent', () => {
  let component: EditManufacturerComponent;
  let fixture: ComponentFixture<EditManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditManufacturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
