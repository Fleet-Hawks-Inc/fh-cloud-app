import { TestBed } from '@angular/core/testing';

import { MapBoxService } from './map-box.service';

describe('MapBoxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapBoxService = TestBed.get(MapBoxService);
    expect(service).toBeTruthy();
  });
});
