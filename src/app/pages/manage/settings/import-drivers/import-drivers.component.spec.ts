import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDriversComponent } from './import-drivers.component';

describe('ImportDriversComponent', () => {
  let component: ImportDriversComponent;
  let fixture: ComponentFixture<ImportDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDriversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
