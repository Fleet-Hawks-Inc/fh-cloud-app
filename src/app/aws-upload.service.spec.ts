import { TestBed } from '@angular/core/testing';

import { AwsUploadService } from './aws-upload.service';

describe('AwsUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AwsUploadService = TestBed.get(AwsUploadService);
    expect(service).toBeTruthy();
  });
});
