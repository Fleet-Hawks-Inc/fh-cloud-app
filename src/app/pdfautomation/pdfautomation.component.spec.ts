import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfautomationComponent } from './pdfautomation.component';

describe('PdfautomationComponent', () => {
  let component: PdfautomationComponent;
  let fixture: ComponentFixture<PdfautomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfautomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfautomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
