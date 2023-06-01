import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Player, PlayerHanidcap } from '../models/player.model';
import * as Query from '../GraphQL/player-handicap-whs.gql';

@Injectable({
    providedIn: 'root',
})
export class PlayerHandicapWhsService {
    constructor(private apollo: Apollo) {}

    public getTorunamentScoreQuery(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.TournamentScoresQueryQL,
                    variables: {
                        tournamentId: tournamentId,
                    },
                })
                .subscribe(({ data }) => {
                    if (!data) {
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    public getPlayersHandicapWhsHistory(
        playerIds: string[],
        playingDate: Date
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.PlayersHandicapWhsHistoryQueryQL,
                    variables: {
                        playerIds: playerIds,
                        playingDate: playingDate,
                    },
                })
                .subscribe(({ data }) => {
                    if (!data) {
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
        });
    }
    public getPlayersHandicapWhsHistoryAboveDate(
        playerIds: string,
        playingDate: Date
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.PlayersHandicapWhsHistoryAboveDateQueryQL,
                    variables: {
                        playerId: playerIds,
                        playingDate: playingDate,
                    },
                })
                .subscribe(({ data }) => {
                    if (!data) {
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    public savePlayerWhsHandicapsForRound(handicapWhsInputs): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SavePlayerWhsHandicapsMutationQL,
                    variables: {
                        handicapsWhs: handicapWhsInputs,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public savePlayersHandicapWhsIndex(playersList, changeLogs): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UpdatePlayersHandicapWhsIndexMutationQL,
                    variables: {
                        playersWithHandicapWhsIndex: playersList,
                        handicapChangeLog: changeLogs,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public savePlayerHandicapWhsIndex(handicapWhsInputs): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UpdatePlayersHandicapWhsIndexQL,
                    variables: {
                        handicapsWhs: handicapWhsInputs,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public updatePlayerHandicapWhsDifferential(handicapWhsInputs): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.updatePlayerHandicapWhsDifferentialQL,
                    variables: {
                        handicapsWhs: handicapWhsInputs,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }
}
