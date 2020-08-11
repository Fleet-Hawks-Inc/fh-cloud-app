import { TestBed } from '@angular/core/testing';

import { AwsDownloadService } from './aws-download.service';

describe('AwsDownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AwsDownloadService = TestBed.get(AwsDownloadService);
    expect(service).toBeTruthy();
  });
});
