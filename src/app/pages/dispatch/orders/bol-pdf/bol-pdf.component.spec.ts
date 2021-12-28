import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolPdfComponent } from './bol-pdf.component';

describe('BolPdfComponent', () => {
  let component: BolPdfComponent;
  let fixture: ComponentFixture<BolPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BolPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BolPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
