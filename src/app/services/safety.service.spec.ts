import { TestBed } from '@angular/core/testing';

import { SafetyService } from './safety.service';

describe('SafetyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SafetyService = TestBed.get(SafetyService);
    expect(service).toBeTruthy();
  });
});
