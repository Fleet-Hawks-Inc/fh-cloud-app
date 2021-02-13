import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfAutomationComponent } from './pdf-automation.component';

describe('PdfAutomationComponent', () => {
  let component: PdfAutomationComponent;
  let fixture: ComponentFixture<PdfAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
