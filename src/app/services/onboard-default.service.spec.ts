import { TestBed } from '@angular/core/testing';

import { OnboardDefaultService } from './onboard-default.service';

describe('OnboardDefaultService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnboardDefaultService = TestBed.get(OnboardDefaultService);
    expect(service).toBeTruthy();
  });
});
