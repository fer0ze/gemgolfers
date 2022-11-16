import { TestBed } from '@angular/core/testing';

import { TournamentsService } from './tournaments.service';

describe('TournamentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TournamentsService = TestBed.get(TournamentsService);
    expect(service).toBeTruthy();
  });
});
