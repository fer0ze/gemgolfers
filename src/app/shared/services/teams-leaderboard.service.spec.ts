import { TestBed } from '@angular/core/testing';

import { TeamsLeaderboardService } from './teams-leaderboard.service';

describe('TeamsLeaderboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamsLeaderboardService = TestBed.get(TeamsLeaderboardService);
    expect(service).toBeTruthy();
  });
});
