import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDataComponent } from './driver-data.component';

describe('DriverDataComponent', () => {
  let component: DriverDataComponent;
  let fixture: ComponentFixture<DriverDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
