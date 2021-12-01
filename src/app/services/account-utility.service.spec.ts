import { TestBed } from '@angular/core/testing';

import { AccountUtilityService } from './account-utility.service';

describe('AccountUtilityService', () => {
  let service: AccountUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
