import { TestBed } from '@angular/core/testing';

import { AccountUtitlityServiceService } from './account-utitlity-service.service';

describe('AccountUtitlityServiceService', () => {
  let service: AccountUtitlityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountUtitlityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
