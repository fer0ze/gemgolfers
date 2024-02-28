import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Tournament, TournamentCategory } from '../models/tournament.model';
import * as Query from '../GraphQL/team-tournament.gql';

@Injectable({
  providedIn: 'root'
})

export class TeamsLeaderboardService {

  constructor(private apollo: Apollo) { }

  public LeaderboardTeamSubscription(tournamentId:string, playerId: string): Promise<any> {
    return new Promise( resolve => {
        this.apollo.subscribe({
        query: Query.LeaderboardTeamSubscription,
        variables: {
          'tournamentId': tournamentId,
          'playerId': playerId
      }
        })
        .subscribe(({ data }) => {
          ////console.log(data.tournament_by_pk);
          ////console.log("data gotten");
          if (!data) {
              resolve(null);
            } else {
              resolve(data);
            }
        });
    });
  }
}
