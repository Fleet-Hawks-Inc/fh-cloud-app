import { TestBed } from '@angular/core/testing';

import { HandleErrorServiceService } from './handle-error-service.service';

describe('HandleErrorServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HandleErrorServiceService = TestBed.get(HandleErrorServiceService);
    expect(service).toBeTruthy();
  });
});
