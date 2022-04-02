import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedAssetsComponent } from './imported-assets.component';

describe('ImportedAssetsComponent', () => {
  let component: ImportedAssetsComponent;
  let fixture: ComponentFixture<ImportedAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportedAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
