import { TestBed } from '@angular/core/testing';

import { InvokeHeaderFnService } from './invoke-header-fn.service';

describe('InvokeHeaderFnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvokeHeaderFnService = TestBed.get(InvokeHeaderFnService);
    expect(service).toBeTruthy();
  });
});
