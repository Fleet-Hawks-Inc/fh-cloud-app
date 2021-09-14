import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdfAutomationComponent } from './pdf-automation.component';

describe('PdfAutomationComponent', () => {
  let component: PdfAutomationComponent;
  let fixture: ComponentFixture<PdfAutomationComponent>;

  beforeEach(waitForAsync(() => {
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
