import { TestBed } from '@angular/core/testing';

import { PdfAutomationService } from './pdf-automation.service';

describe('PdfAutomationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfAutomationService = TestBed.get(PdfAutomationService);
    expect(service).toBeTruthy();
  });
});
