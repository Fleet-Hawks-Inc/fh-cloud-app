import { TestBed } from '@angular/core/testing';

import { HereMapService } from './here-map.service';

describe('HereMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HereMapService = TestBed.get(HereMapService);
    expect(service).toBeTruthy();
  });
});
