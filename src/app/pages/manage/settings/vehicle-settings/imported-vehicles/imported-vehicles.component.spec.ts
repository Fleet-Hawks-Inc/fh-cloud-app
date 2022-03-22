import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedVehiclesComponent } from './imported-vehicles.component';

describe('ImportedVehiclesComponent', () => {
  let component: ImportedVehiclesComponent;
  let fixture: ComponentFixture<ImportedVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
