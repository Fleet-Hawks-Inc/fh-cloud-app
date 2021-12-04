import { TestBed } from '@angular/core/testing';

import { DashboardUtilityService } from './dashboard-utility.service';

describe('DashboardUtilityService', () => {
  let service: DashboardUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
