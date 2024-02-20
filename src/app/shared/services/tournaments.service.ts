import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    AddDailyRound,
    Tournament,
    TournamentCategory,
    TournamentMember,
} from '../models/tournament.model';
import {
    handicap_change_log,
    Player,
    PlayerHanidcap,
} from '../models/player.model';
import * as Query from '../GraphQL/tournament.gql';
import { resolve } from 'url';
import { AnyNsRecord, AnyPtrRecord } from 'dns';
import { Observable, tap, from, switchMap, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Team } from '../models/team.model';

@Injectable({
    providedIn: 'root',
})
export class TournamentsService {
    constructor(private apollo: Apollo, private storage: AngularFireStorage) { }

    public getTournamentsListForCompleted(endDate: Date): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamentsForAdminCompeleted,

                    variables: {
                        endDate: endDate,
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

    public getTournamentsListForLiveByAdmin(endDate: Date): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForLiveByAdmin,

                    variables: {
                        endDate: endDate,
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
    public getTournamentsListForSheduleByAdmin(endDate: Date): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForScheduleByAdmin,

                    variables: {
                        endDate: endDate,
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
    public getTournamentsListForIncompleteByAdmin(endDate: Date): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForIncompleteByAdmin,

                    variables: {
                        endDate: endDate,
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

    public getTournamentsListByClub(
        endDate: Date,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamentsByClub,
                    variables: {
                        endDate: endDate,
                        clubId: clubId,
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

    public getTournamentsListByClubForCompleted(
        endDate: Date,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForCompleted,
                    variables: {
                        endDate: endDate,
                        clubId: clubId,
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
    public getTournamentsListByTourForCompleted(
        tourId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getTournamentsListByTourForCompleted,
                    variables: {
                        tourId: tourId,
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
    public getTournamentsListForLive(
        endDate: Date,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForLive,
                    variables: {
                        endDate: endDate,
                        clubId: clubId,
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

    public getTournamentsListByClubForSchedule(
        endDate: Date,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForSchedule,
                    variables: {
                        endDate: endDate,
                        clubId: clubId,
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

    public getTournamentsListByClubForIncompelete(
        endDate: Date,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamnetListForIncomplete,
                    variables: {
                        endDate: endDate,
                        clubId: clubId,
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

    public getActiveTournamentsList(todayDate: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTournamentsByClub,
                    variables: {
                        where: {
                            endDate: {
                                _gte: todayDate,
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

    public getDailyRounds(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        console.log(clubId);
        console.log(fromDate);
        console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.ClubSingleRoundFlightsQueryQL,
                    variables: {
                        clubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyRoundsSingle(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.ClubSingleRoundFlightsQueryQLs,
                    variables: {
                        clubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyCardSingle(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.getDailyCardSingle,
                    variables: {
                        clubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyRoundsSingleAdmin(
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.ClubSingleRoundFlightsAdminQueryQLs,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyCardSingleAdmin(
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.getDailyCardSingleAdmin,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyRoundsStat(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.DailyRoundsStatQueryQLs,
                    variables: {
                        clubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyRoundsStatAdmin(
        fromDate: string,
        toDate: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.DailyRoundsStatQueryAdminQLs,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyRoundsSingleDashboardAll(
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.DailyRoundsSingleDashboardQueryQLsAll,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getDailyRoundsSingleDashboard(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.DailyRoundsSingleDashboardQueryQLs,
                    variables: {
                        clubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getAll(
        Id: string,
        clubId: string,
        fromDate: string,
        toDate: string
    ): Observable<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return this.apollo
            .subscribe<any>({
                query: Query.getallDashboard,
                variables: {
                    adminId: Id,
                    adminClubId: clubId,
                    fromDate: fromDate,
                    toDate: toDate,
                },
            })
            .pipe(tap((data) => console.log(data)));
    }
    public getAllAdmin(fromDate: string, toDate: string): Promise<any> {
        // console.log(clubId);
        // console.log(fromDate);
        // console.log(toDate);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.getAllAdmin,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .subscribe(({ data }) => {
                    // console.log(data);
                    resolve(data);
                });
        });
    }
    public getSingleDailyRound(
        clubId: string,

        Date: string
    ): Promise<any> {
        console.log(clubId);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.ClubSingleRoundFlightsQueryQLA,
                    variables: {
                        clubId: clubId,

                        toDate: Date,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }
    public getSingleDailyRoundAdmin(Date: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.ClubSingleRoundFlightsQueryAdminQLA,
                    variables: {
                        toDate: Date,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }
    public getRoundScore(Id: any): Promise<any> {
        console.log(Id);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.RoundScoreQLA,
                    variables: {
                        id: Id,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }
    public getPlayerScorebyID(Id: any): Promise<any> {
        console.log(Id);
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.getPlayerScorebyIDQLA,
                    variables: {
                        id: Id,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }

    public getClubActiveTournamentsList(
        endDate: string,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetUpCommingTournamentsByClub,
                    variables: {
                        where: {
                            _and: [
                                {
                                    endDate: {
                                        _gte: endDate,
                                    },
                                    clubId: {
                                        _eq: clubId,
                                    },
                                },
                            ],
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

    public getClubDashboardStats(
        endDate: string,
        clubId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetClubDashboardStatsQL,
                    variables: {
                        endDate: endDate,
                        clubId: clubId,
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

    public getClubDashboardStatsForAdmin(endDate: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetClubDashboardStatsQLs,
                    variables: {
                        endDate: endDate,
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
    public getTournamentCountsByClub(clubId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getTournamentCountsByClub,
                    variables: {
                        where: {
                            _and: [
                                {
                                    singleRound: {
                                        _eq: false,
                                    },
                                    clubId: {
                                        _eq: clubId,
                                    },
                                },
                            ],
                        },
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }
    public getTournamentCountsByClubAll(): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getTournamentCountsByClubAll,
                    variables: {
                        where: {
                            singleRound: {
                                _eq: false,
                            },
                        },
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }
    public getLeagues(): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getLeagues,
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }
    public getLeaguesByClub(id): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getLeaguesByClub,
                    variables: {
                        adminId: id,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }
    public getLeageLeaderBoards(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getLeageLeaderBoards,
                    variables: {
                        leagueId: id,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }
    public getLeagueName(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getLeagueName,
                    variables: {
                        leagueId: id,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public LeaderboardOneTimeDataQuery(
        tournamentId: string,
        playerId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.LeaderboardOneTimeDataQueryQL,
                    variables: {
                        tournamentId: tournamentId,
                        playerId: playerId,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public LeaderboardSubscription(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.LeaderboardSubscription,
                    variables: {
                        tournamentPrefix: tournamentId,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public tournamentDashBoard(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.tournamentDashBoard,
                    variables: {
                        tournamentPrefix: tournamentId,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }
    public getTourGuide(tourId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getTourGuides,
                    variables: {
                        tourId: tourId,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public LeaderboardSubscriptions(
        tournamentId: string,
        cat: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.LeaderboardSubscriptions,
                    variables: {
                        where: {
                            _and: [
                                {
                                    tournamentId: {
                                        _eq: tournamentId,
                                    },
                                },
                                {
                                    category: {
                                        _eq: cat,
                                    },
                                },
                            ],
                        },
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public LeaderRoundsSubscription(
        tournamentId: string,
        activeRound: number
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.LeaderRoundsSubscriptionQL,
                    variables: {
                        tournamentId: tournamentId,
                        activeRound: activeRound,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public checkPrefix(prefix: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.GetTournementByFilter,
                    variables: {
                        where: {
                            prefix: {
                                _eq: prefix,
                            },
                        },
                    },
                })
                .subscribe(({ data }) => {
                    resolve(data.tournament);
                });
        });
    }

    public LeaderRoundQuery(tournamentId: string, round: number): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.LeaderRoundQueryQL,
                    variables: {
                        tournamentId: tournamentId,
                        round: round,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        //console.log(data);
                        resolve(data);
                    }
                });
        });
    }

    public tournamentScoreLoader(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.TournamentScoresQuery,
                    variables: {
                        tournamentId: tournamentId,
                    },
                })
                .subscribe(({ data }) => {
                    //console.log(data.tournament_by_pk);
                    //console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    getTournamentByID(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetTournamentByID,
                    variables: {
                        where: {
                            id: {
                                _eq: id,
                            },
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }

    getFlightSettings(tournamentId: string, category: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetFlightSettings,
                    variables: {
                        where: {
                            tournamentId: {
                                _eq: tournamentId,
                            },
                            category: {
                                _eq: category,
                            },
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }

    // deleteActiveTournament( tou: string) : Promise<boolean> {

    //   return new Promise( resolve => {
    //     this.apollo.mutate<any>({
    //       mutation: Query.DeletePlayer,
    //       variables: {
    //         'where': {
    //           'clubId': {
    //             '_eq': clubId
    //           },
    //           'playerId': {
    //             '_eq': playerId
    //           }
    //         }
    //       }
    //     }).subscribe(({ data }) => {
    //       console.log(data);
    //       resolve(true);
    //     }, (error) => {
    //       resolve(false);
    //       console.log('Could delete add due to ' + error);
    //     });
    //   });
    // }
    public addTour(tour: any, file: File): Observable<string> {
        const fileName = 'tour/' + tour.id + '.png';
        const ref = this.storage.ref(fileName);
        const task = ref.put(file);

        return from(task).pipe(
            switchMap((snapshot: any) => {
                return ref.getDownloadURL();
            }),
            switchMap((downloadUrl: string) => {
                // Update the picture URL in the account object
                tour.logo = downloadUrl;

                // Perform the mutation using Apollo client
                return this.apollo
                    .mutate<any>({
                        mutation: Query.insertTourQL,
                        variables: {
                            tour: tour
                        },
                    })
                    .pipe(
                        map((response: any) => {
                            // Return the download URL
                            return downloadUrl;
                        })
                    );
            })
        );
    }
    public addTournament(tmnt: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.AddMutation,
                    variables: {
                        objects: [
                            {
                                id: tmnt.id,
                                clubId: tmnt.clubId,
                                leagueId: tmnt.leagueId,
                                courseId: tmnt.courseId,
                                adminId: tmnt.adminId,
                                title: tmnt.title,
                                prefix: tmnt.prefix,
                                courseHoleSets: tmnt.courseHoleSets,
                                teamMatch: tmnt.teamMatch,
                                pairsMatch: tmnt.pairsMatch,
                                interLeague: tmnt.interLeague,
                                publicTournament: tmnt.publicTournament,
                                confirmParticipants: tmnt.confirmParticipants,
                                noOfRounds: tmnt.noOfRounds,
                                activeRound: tmnt.activeRound,
                                matchFormat: tmnt.matchFormat,
                                playingOnWhs: tmnt.playingOnWhs,
                                pointsFormats: tmnt.pointsFormats,
                                pointsValues: tmnt.pointsValues,
                                handicapAllocations: tmnt.handicapAllocations,
                                tee: tmnt.tee,
                                scoreManagement: tmnt.scoreManagement,
                                startDate: tmnt.startDate,
                                endDate: tmnt.endDate,
                                started: tmnt.started,
                                invited: tmnt.invited,
                                singleRound: tmnt.singleRound,
                                sponsorName: tmnt.sponsorName,
                                sponsorLogo: tmnt.sponsorLogo,
                                mobileLogoUrl: tmnt.mobileLogoUrl,
                                webLogoUrl: tmnt.webLogoUrl,
                                noofMarshals: tmnt.noofMarshals,
                                marshalStart: tmnt.marshalStart,
                                flightsCategory: tmnt.flightsCategory,
                                subTournament: tmnt.subTournament,
                                multiFormat: tmnt.multiFormat,
                                createdAt: tmnt.createdAt,
                                tourId: tmnt.tourId,
                                categories: {
                                    data: tmnt.categories,
                                },
                                marshals: {
                                    data: tmnt.marshals,
                                },
                                flights: {
                                    data: tmnt.flights,
                                },
                                members: {
                                    data: tmnt.members,
                                },
                            },
                        ],
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
    public addSubTournament(obj: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.AddSubTournamentMutation,
                    variables: {
                        subTournaments: obj,
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

    /*
    updateClub(club:Tournament): Promise<boolean> {
      console.log(club.id);
      return new Promise( resolve => {
        this.apollo.mutate<any>({
          mutation: Query.UpdateMutation,
          variables: {
            'where': {
              'id': {
                '_eq': club.id
              }
            },
            'set':
            {
              'name': club.name,
              'address': club.address,
              'email': club.email,
              'phone': club.phone
            }
          }
        }).subscribe(({ data }) => {
          resolve(true);
        }, (error) => {
          resolve(false);
          console.log('Could update add due to ' + error);
        });
      });
    } */

    deleteTournamentMember(
        tournamentId: string,
        playerId: string
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeleteTournamentMember,
                    variables: {
                        where: {
                            _and: [
                                {
                                    tournamentId: {
                                        _eq: tournamentId,
                                    },
                                    playerId: {
                                        _eq: playerId,
                                    },
                                },
                            ],
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could delete add due to ' + error);
                    }
                );
        });
    }

    deleteTourGuide(
        id: string
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeleteTourGuide,
                    variables: {
                        where: {
                            id: {
                                _eq: id,
                            },
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could delete add due to ' + error);
                    }
                );
        });
    }

    deleteClub(id: string): Promise<boolean> {
        //console.log(id);
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeleteClub,
                    variables: {
                        where: {
                            id: {
                                _eq: id,
                            },
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
                        //console.log('Could delete add due to ' + error);
                    }
                );
        });
    }

    public savePlayerHandicaps(
        handicaps: PlayerHanidcap[],
        players: Player[],
        handicapChange: handicap_change_log[]
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SavePlayerHandicapsMutation,
                    variables: {
                        handicaps: handicaps,
                        players: players,
                        handicapChangeLog: handicapChange,
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

    public UndoTournamentRound(
        tournamentId: string,
        flightRound: number,
        resetRound: number,
        cut: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UndoTournamentRoundMutation,
                    variables: {
                        tournamentId: tournamentId,
                        flightRound: flightRound,
                        resetRound: resetRound,
                        cut: cut,
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

    public getsuperAdminStats(): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.superAdminStatsQL,
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

    getTournamentMembers(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.TournamentMembersQL,
                    variables: {
                        where: {
                            _and: [
                                {
                                    tournamentId: {
                                        _eq: tournamentId,
                                    },
                                    status: {
                                        _eq: true,
                                    },
                                },
                            ],
                        },
                    },
                })
                .subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }

    public markActiveTournamentMembers(
        tournamentId: string,
        tournamentMembers: TournamentMember[]
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.markActiveTournamentMemberQL,
                    variables: {
                        tournamentId: tournamentId,
                        tournamentMembers: tournamentMembers,
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

    public insertTournamentMember(
        tournamentMembers: TournamentMember[]
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.insertTournamentMemberQL,
                    variables: {
                        tournamentMembers: tournamentMembers,
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
    public insertTourGuide(
        tourGuide: any[]
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.insertTourGuideQL,
                    variables: {
                        tourGuide: tourGuide,
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
    public insertTournamentTeam(
        teamsToSave: Team[], tournamentId
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.insertTournamentTeamQL,
                    variables: {

                        teamsToSave: teamsToSave,

                    },
                })
                .subscribe(
                    ({ data }) => {
                        //console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        console.log('Could not add due to ' + error);
                        resolve(false);
                    }
                );
        });
    }
    public insertTournamentMemberStatus(
        tournamentMembers: any[]
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.insertTournamentMemberStatusQL,
                    variables: {
                        tournamentMembers: tournamentMembers,
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

    public insertClubMember(clubId: string, playerId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.insertClubMemberQL,
                    variables: {
                        objects: [
                            {
                                clubId: clubId,
                                playerId: playerId,
                                suspended: false,
                            },
                        ],
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

    public setScoreUpdateTime(
        tournamentId: string,
        date: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.setScoreUpdateTimeQL,
                    variables: {
                        tournamentId: tournamentId,
                        date: date,
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

    public updateFlightSettings(
        tournamentId: string,
        category: string,
        flightSettings: JSON
    ): Promise<any> {
        console.log(flightSettings);
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.updateTournamentFlightSettings,
                    variables: {
                        where: {
                            tournamentId: {
                                _eq: tournamentId,
                            },
                            category: {
                                _eq: category,
                            },
                        },
                        set: {
                            flightSettings: flightSettings,
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not update add due to ' + error);
                    }
                );
        });
    }

    public leaderAllRoundData(tournamentId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.LeaderAllRoundDataQL,
                    variables: {
                        tournamentId: tournamentId,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }

    public eliminateRound(
        oldFlightId: string,
        newFlightId: string,
        playerId: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.eliminateRoundQL,
                    variables: {
                        oldFlightId: oldFlightId,
                        newFlightId: newFlightId,
                        playerId: playerId,
                    },
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    resolve(data);
                });
        });
    }

    public editTournament(
        tournament: any,
        category,
        marshals: any
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UpdateMutation,
                    variables: {
                        tournament: tournament,
                        category: category,
                        marshals: marshals,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could Not Update due to' + error);
                    }
                );
        });
    }

    public getPlayersListByTournamentAndCategory(
        id: string,
        category: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetPlayersByClub,
                    variables: {
                        where: {
                            _and: [
                                {
                                    player: {
                                        playerCategory: {
                                            _eq: category,
                                        },
                                    },
                                },
                                {
                                    tournamentId: {
                                        _eq: id,
                                    },
                                },
                            ],
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

    public getTournamentLeaderBoard(tournamentId: String): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.LeaderboardSubscription,
                    variables: {
                        tournamentPrefix: tournamentId,
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
