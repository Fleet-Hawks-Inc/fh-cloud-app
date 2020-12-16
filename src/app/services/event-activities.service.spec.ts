import { TestBed } from '@angular/core/testing';

import { EventActivitiesService } from './event-activities.service';

describe('EventActivitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventActivitiesService = TestBed.get(EventActivitiesService);
    expect(service).toBeTruthy();
  });
});
