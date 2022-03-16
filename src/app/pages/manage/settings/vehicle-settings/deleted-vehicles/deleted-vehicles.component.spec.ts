import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedVehiclesComponent } from './deleted-vehicles.component';

describe('DeletedVehiclesComponent', () => {
  let component: DeletedVehiclesComponent;
  let fixture: ComponentFixture<DeletedVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
