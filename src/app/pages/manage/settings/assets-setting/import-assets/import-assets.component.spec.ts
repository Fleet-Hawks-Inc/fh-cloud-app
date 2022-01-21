import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAssetsComponent } from './import-assets.component';

describe('ImportAssetsComponent', () => {
  let component: ImportAssetsComponent;
  let fixture: ComponentFixture<ImportAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
