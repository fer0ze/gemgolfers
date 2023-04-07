import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Flight, FlightMembers } from '../models/flight.model';
import { Player } from '../models/player.model';
import * as Query from '../GraphQL/flights.gql';

@Injectable({
    providedIn: 'root',
})
export class FlightsService {
    constructor(private apollo: Apollo) {}

    public SaveTournamentFlights(
        tournamentId: string,
        flightsToSave: any,
        flightMembersToSave: any
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SaveTournamentFlightsMutation,
                    variables: {
                        tournamentId: tournamentId,
                        //'flightIdsToRemove': flightIdsToRemove,
                        ////'flightMembersToRemove': flightMembersToRemove,
                        // "flightMembersToRemove": {
                        //     "flightId": {
                        //       "_in": membersFromFlightToRemove
                        //     },
                        //     "playerId": {
                        //       "_in": flightMembersToRemove
                        //     }
                        //   },

                        flightsToSave: flightsToSave,
                        flightMembersToSave: flightMembersToSave,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public SaveTournamentFlightfortaxes(
        tournamentId: string,
        flightNamesToSave: any,
        flightsToSave: any,
        flightMembersToSave: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SaveTournamentFlightsMutationsForTaxes,
                    variables: {
                        tournamentId: tournamentId,
                        //'flightIdsToRemove': flightIdsToRemove,
                        ////'flightMembersToRemove': flightMembersToRemove,
                        // "flightMembersToRemove": {
                        //     "flightId": {
                        //       "_in": membersFromFlightToRemove
                        //     },
                        //     "playerId": {
                        //       "_in": flightMembersToRemove
                        //     }
                        //   },
                        flightNamesToSave: flightNamesToSave,
                        flightsToSave: flightsToSave,
                        flightMembersToSave: flightMembersToSave,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public SaveTournamentFlight(
        tournamentId: string,

        flightsToSave: any,
        flightMembersToSave: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SaveTournamentFlightsMutation,
                    variables: {
                        tournamentId: tournamentId,
                        //'flightIdsToRemove': flightIdsToRemove,
                        ////'flightMembersToRemove': flightMembersToRemove,
                        // "flightMembersToRemove": {
                        //     "flightId": {
                        //       "_in": membersFromFlightToRemove
                        //     },
                        //     "playerId": {
                        //       "_in": flightMembersToRemove
                        //     }
                        //   },

                        flightsToSave: flightsToSave,
                        flightMembersToSave: flightMembersToSave,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public SaveRoundFlight(flightsToSave: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SaveRoundFlightsMutation,
                    variables: {
                        flightsToSave: flightsToSave,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public saveFlightMembers(
        flightId: string,
        flightMembersToSave: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SaveFlightsMembersMutation,
                    variables: {
                        flightMembersToSave: flightMembersToSave,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public copyPlayerScore(
        playerId: string,
        fromFlight: string,
        toFlight: string
    ) {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.ChangeScoresFlightMutation,
                    variables: {
                        playerId: playerId,
                        flightIdFrom: fromFlight,
                        flightIdTo: toFlight,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public getTotalFlightsAll(): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getFlightTotalAll,
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(data);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public getTotalFlights(clubId): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getFlightTotal,
                    variables: {
                        where: {
                            admin: {
                                adminClubId: {
                                    _eq: clubId,
                                },
                            },
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(data);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public DeleteFlightsAndMembers(
        flightIdsToRemove: string[],
        membersFromFlightToRemove: string[],
        flightMembersToRemove: string[]
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeleteFlightsAndMembersMutation,
                    variables: {
                        flightIdsToRemove: flightIdsToRemove,
                        // "flightMembersToRemove": {
                        //     "flightId": {
                        //       "_in": membersFromFlightToRemove
                        //     },
                        //     "playerId": {
                        //       "_in": flightMembersToRemove
                        //     }
                        //   }
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public moveFlightsPlayer(flightMembersToSave: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.moveFlightsPlayerMutation,
                    variables: {
                        flightMembersToSave: flightMembersToSave,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }
    public DeleteFlightMembers(
        flightid: any,
        flightMembersToRemove: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeleteFlightMembersMutation,
                    variables: {
                        membersDeleteExpression: {
                            _and: [
                                {
                                    flightId: {
                                        _eq: flightid,
                                    },
                                },
                                {
                                    playerId: {
                                        _eq: flightMembersToRemove,
                                    },
                                },
                            ],
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public getTournamentsFlights(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.FlightManagersQuery,
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

    public markPlayerAttendance(
        flightId: string,
        playerId: string,
        status: boolean
    ) {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.MarkPlayerAttendance,
                    variables: {
                        where: {
                            flightId: {
                                _eq: flightId,
                            },
                            playerId: {
                                _eq: playerId,
                            },
                        },
                        set: {
                            attendance: status,
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public closeActiveRound(
        tournamentId: string,
        round: number,
        cutOffCriteria: any
    ) {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.closeActiveRound,
                    variables: {
                        where: {
                            id: {
                                _eq: tournamentId,
                            },
                        },
                        set: {
                            activeRound: round,
                            cutOffCriteria: cutOffCriteria,
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public createNextRoundFlights(flights: Flight[]): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.createNextRoundFlights,
                    variables: {
                        objects: flights,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public addFlightName(flights: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.addFlightName,
                    variables: {
                        flightNamesToSave: flights,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public updateDailyRoundCourseHoleset(
        tournamentId: string,
        courseHolset: number,
        courseHoleSetsInverted: boolean,
        deleteAndInsertScores: boolean,
        scoreDetailsDelete: string[],
        scoreFlightIdsToRemove: string[],
        scorePlayerIdsToRemove: string[],
        scoresToInsert: any,
        tee: any,
        time: any,
        flightMembers: any[],
        deleteMember: any[],
        flightId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UpsertFlightAndMembersMutation,
                    variables: {
                        tournamentId: tournamentId,
                        courseHolset: courseHolset,
                        courseHoleSetsInverted: courseHoleSetsInverted,
                        deleteAndInsertScores: deleteAndInsertScores,
                        scoreDetailsDeleteExpression: {
                            id: {
                                _in: scoreDetailsDelete,
                            },
                        },
                        scoresDeleteExpression: {
                            _and: [
                                {
                                    flightId: {
                                        _in: scoreFlightIdsToRemove,
                                    },
                                },
                                {
                                    playerId: {
                                        _in: scorePlayerIdsToRemove,
                                    },
                                },
                            ],
                        },
                        // 'scoresToInsert': {
                        //   'playerId': scoresToInsert.playerId,
                        //   'flightId': scoresToInsert.flightId,
                        //   'holeId': scoresToInsert.holeId,
                        //   'playerHandicap': scoresToInsert.playerHandicap,
                        //   'grossScore': scoresToInsert.grossScore,
                        //   'updatedAt': scoresToInsert.updatedAt,
                        //   'updaterId': scoresToInsert.updaterId,
                        //   'updaterName': scoresToInsert.updaterName,
                        //   'detailId': null,
                        //   'detail': {
                        //     'data': scoresToInsert.detail
                        //   }
                        scoresToInsert: scoresToInsert,
                        tee: tee,
                        time: time,
                        members: flightMembers,
                        membersDeleteExpression: {
                            _and: [
                                {
                                    flightId: {
                                        _eq: flightId,
                                    },
                                },
                                {
                                    playerId: {
                                        _in: deleteMember,
                                    },
                                },
                            ],
                        },
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

    public singleRoundFlightsQuery(flightId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.singleRoundFlightsQueryQL,
                    variables: {
                        where: {
                            id: {
                                _eq: flightId,
                            },
                        },
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

    public singleRoundFlightQuery(flightId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.singleRoundFlightQueryQL,
                    variables: {
                        flightId: flightId,
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
    public deletePlayerHandiCal(
        tournamnetId,
        PlayersIds: any
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deletePlayerHandiCalQueryQL,
                    variables: {
                        tournamnetId: tournamnetId,
                        PlayersIds: PlayersIds,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not delete due to ' + error);
                    }
                );
        });
    }
    public undoFlightHandicap(flightId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.undoFlightHandicapQL,
                    variables: {
                        flightId: flightId,
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
}
