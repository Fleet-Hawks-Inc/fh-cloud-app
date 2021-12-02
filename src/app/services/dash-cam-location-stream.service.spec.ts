import { TestBed } from '@angular/core/testing';

import { DashCamLocationStreamService } from './dash-cam-location-stream.service';

describe('DashCamLocationStreamService', () => {
  let service: DashCamLocationStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashCamLocationStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
