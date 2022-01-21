import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOverviewComponent } from './import-overview.component';

describe('ImportOverviewComponent', () => {
  let component: ImportOverviewComponent;
  let fixture: ComponentFixture<ImportOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
