import { TestBed } from '@angular/core/testing';

import { CheckProfileServiceService } from './check-profile-service.service';

describe('CheckProfileServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckProfileServiceService = TestBed.get(CheckProfileServiceService);
    expect(service).toBeTruthy();
  });
});
