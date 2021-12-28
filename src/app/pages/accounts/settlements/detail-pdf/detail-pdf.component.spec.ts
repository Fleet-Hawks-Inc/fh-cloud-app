import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPdfComponent } from './detail-pdf.component';

describe('DetailPdfComponent', () => {
  let component: DetailPdfComponent;
  let fixture: ComponentFixture<DetailPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
