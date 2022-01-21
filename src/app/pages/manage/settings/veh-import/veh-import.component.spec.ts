import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehImportComponent } from './veh-import.component';

describe('VehImportComponent', () => {
  let component: VehImportComponent;
  let fixture: ComponentFixture<VehImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
