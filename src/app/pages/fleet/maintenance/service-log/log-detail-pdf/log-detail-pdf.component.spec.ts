import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogDetailPdfComponent } from './log-detail-pdf.component';

describe('LogDetailPdfComponent', () => {
  let component: LogDetailPdfComponent;
  let fixture: ComponentFixture<LogDetailPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogDetailPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDetailPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
