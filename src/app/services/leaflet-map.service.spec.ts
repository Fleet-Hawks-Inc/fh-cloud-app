import { TestBed } from '@angular/core/testing';

import { LeafletMapService } from './leaflet-map.service';

describe('LeafletMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeafletMapService = TestBed.get(LeafletMapService);
    expect(service).toBeTruthy();
  });
});
