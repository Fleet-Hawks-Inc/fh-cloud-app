import { TestBed } from '@angular/core/testing';

import { CachedService } from './cached.service';

describe('CachedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CachedService = TestBed.get(CachedService);
    expect(service).toBeTruthy();
  });
});
