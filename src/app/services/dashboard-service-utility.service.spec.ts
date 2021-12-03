import { TestBed } from '@angular/core/testing';

import { DashboardServiceUtilityService } from './dashboard-service-utility.service';

describe('DashboardServiceUtilityService', () => {
  let service: DashboardServiceUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardServiceUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
