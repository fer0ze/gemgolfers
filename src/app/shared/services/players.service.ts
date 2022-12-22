import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
    Player,
    PlayerCategory,
    ClubMembership,
    Marshal,
    handicap_change_log,
} from '../models/player.model';
import * as Query from '../GraphQL/player.gql';
//import { map } from "rxjs/operators";
//import { toDate } from "@angular/common/src/i18n/format_date";

@Injectable({
    providedIn: 'root',
})
export class PlayersService {
    constructor(private apollo: Apollo) {}

    public getPlayersList(): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetPlayers,
                })
                .subscribe(({ data }) => {
                    console.log(data);
                    if (!data) {
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    public getPlayersListByClub(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetPlayersByClub,
                    variables: {
                        where: {
                            membership: {
                                clubId: {
                                    _eq: id,
                                },
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
    public getPlayersListByClubCONGU(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getPlayersListByClubCONGU,
                    variables: {
                        where: {
                            membership: {
                                clubId: {
                                    _eq: id,
                                },
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
    public getPlayersListByClubOnlyWHS(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getPlayersListByClubOnlyWHS,
                    variables: {
                        where: {
                            membership: {
                                clubId: {
                                    _eq: id,
                                },
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
    public getTotalPlayers(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.getTotalPlayers,
                    variables: {
                        where: {
                            membership: {
                                clubId: {
                                    _eq: id,
                                },
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
    public getTotalFlightPlayed(
        id: string,
        fromDate: string,
        toDate: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.GetTotalFLightPlayed,
                    variables: {
                        where: {
                            _and: [
                                {
                                    membership: { club: { id: { _eq: id } } },
                                },
                                {
                                    flights_played: {
                                        flight: { date: { _gte: toDate } },
                                    },
                                },
                                {
                                    flights_played: {
                                        flight: { date: { _lte: fromDate } },
                                    },
                                },
                            ],
                        },
                        date: fromDate,
                        sdate: toDate,
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

    public getPlayersListByClubAndCategory(
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
                                    membership: {
                                        clubId: {
                                            _eq: id,
                                        },
                                    },
                                },
                                {
                                    playerCategory: {
                                        _eq: category,
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

    public getPlayerHandicapListByClub(clubId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.PlayerHandicapListByClubQL,
                    variables: {
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

    public playerUpdatedHandicapReport(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.playerUpdatedHandicapReport,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
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
    public playerUpdatedHandicapWHSReport(
        clubId: string,
        fromDate: string,
        toDate: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.playerUpdatedHandicapWHSReport,
                    variables: {
                        clubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
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

    public getPlayerHandicapListByPlayerId(
        playerId: string,
        fromDate: any,
        toDate: any
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.PlayerHandicapListByplayerIdQL,
                    variables: {
                        where: {
                            _and: [
                                { members: { playerId: { _eq: playerId } } },
                                { date: { _gte: toDate } },
                                { date: { _lte: fromDate } },
                            ],
                        },
                        playerId: playerId,
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

    getPlayerByID(id: string) {
        return this.apollo.subscribe<any>({
            query: Query.GetPlayerByID,
            variables: {
                where: {
                    id: {
                        _eq: id,
                    },
                },
            },
        });
    }

    getPlayerByGEMID(GEMID: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByFilter,
                    variables: {
                        where: {
                            gemId: {
                                _eq: GEMID,
                            },
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }

    getPlayerByPhone(phone: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByFilter,
                    variables: {
                        where: {
                            phone: {
                                _eq: phone,
                            },
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }

    getPlayerByMembershipNumberForSearch(
        clubID: string,
        membershipNumber: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByFilter,
                    variables: {
                        where: {
                            _and: [
                                { membership: { clubId: { _eq: clubID } } },
                                { membershipNumber: { _eq: membershipNumber } },
                            ],
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }
    getPlayerByMembershipNumber(membershipNumber: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByMembershipNumber,
                    variables: {
                        where: { membershipNumber: { _eq: membershipNumber } },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }

    getPlayerByEmail(email: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByFilter,
                    variables: {
                        where: {
                            email: {
                                _eq: email,
                            },
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }

    getPlayerByFirstName(firstName: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByFirstName,
                    variables: {
                        where: {
                            _and: [
                                {
                                    firstName: {
                                        _eq: firstName,
                                    },
                                    phone: {
                                        _is_null: true,
                                    },
                                },
                            ],
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }

    getPlayerByCategory(category: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByFilter,
                    variables: {
                        where: {
                            playerCategory: {
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

    getPlayerByClub(clubId: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerByClub,
                    variables: {
                        where: {
                            clubId: {
                                _eq: clubId,
                            },
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }

    public searchPlayer(
        firstName: string,
        lastName: string,
        playerCategory: string,
        handicapLower: number,
        handicapUpper: number
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.searchPlayerQL,
                    variables: {
                        firstName: firstName,
                        lastName: lastName,
                        playerCategory: playerCategory,
                        handicapLower: handicapLower,
                        handicapUpper: handicapUpper,
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

    public searchPlayerForTournament(
        fullName: string,
        handicapLower: number,
        handicapUpper: number
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.searchPlayerForTournamentQL,
                    variables: {
                        fullName: fullName,
                        handicapLower: handicapLower,
                        handicapUpper: handicapUpper,
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

    public AddPlayer(player: Player): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.AddMutation,
                    variables: {
                        objects: [
                            {
                                id: player.id,
                                adminClubId: player.adminClubId,
                                firebaseUid: player.firebaseUid,
                                fcmToken: player.fcmToken,
                                gemId: player.gemId,
                                firstName: player.firstName,
                                lastName: player.lastName,
                                gender: player.gender,
                                dob: player.dob,
                                picture: player.picture,
                                email: player.email,
                                phone: player.phone,
                                playerCategory: player.playerCategory,
                                handicap: player.handicap,
                                online: player.online,
                                extraData: player.extraData,
                                countryCode: player.countryCode,
                                userRole: player.userRole,
                                membershipNumber: player.membershipNumber,
                                membership: {
                                    data: player.membership,
                                },
                            },
                        ],
                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public AddHandicapRemarks(
        handicap_change_log: handicap_change_log
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.AddMutationHandicapLog,
                    variables: {
                        objects: [
                            {
                                id: handicap_change_log.id,
                                playerId: handicap_change_log.playerId,
                                oldHandicap: handicap_change_log.oldHandicap,
                                newHandicap: handicap_change_log.newHandicap,
                                whs: handicap_change_log.whs,
                                dateTime: handicap_change_log.dateTime,
                                remarks: handicap_change_log.remarks,
                                tournamentId: handicap_change_log.tournamentId,
                                updaterId: handicap_change_log.updaterId,
                            },
                        ],
                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    public importPlayerList(
        players: Player[],
        clubMembers: ClubMembership[]
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.SavePlayersList,
                    variables: {
                        playersToSave: players,
                        clubmembers: clubMembers,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    updatePlayer(player: Player): Promise<boolean> {
        console.log(player.id);
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UpdateMutation,
                    variables: {
                        where: {
                            id: {
                                _eq: player.id,
                            },
                        },
                        set: {
                            adminClubId: player.adminClubId,
                            firebaseUid: player.firebaseUid,
                            fcmToken: player.fcmToken,
                            gemId: player.gemId,
                            firstName: player.firstName,
                            lastName: player.lastName,
                            gender: player.gender,
                            dob: player.dob,
                            picture: player.picture,
                            email: player.email,
                            phone: player.phone,
                            playerCategory: player.playerCategory,
                            handicap: player.handicap,
                            online: player.online,
                            extraData: player.extraData,
                            countryCode: player.countryCode,
                            userRole: player.userRole,
                            membershipNumber: player.membershipNumber,
                        },
                        playerID: player.id,
                        clubID: player.membership[0].clubId,
                        suspended: player.membership[0].suspended,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        console.log('Could update add due to ' + error);
                    }
                );
        });
    }

    deletePlayer(clubId: string, playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeletePlayer,
                    variables: {
                        where: {
                            clubId: {
                                _eq: clubId,
                            },
                            playerId: {
                                _eq: playerId,
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

    getPlayerFlightScores(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.PlayerFlightScoresQuery,
                    variables: {
                        playerId: id,
                    },
                })
                .subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }

    getPlayerlistbyName(FirstName: string, LastName: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.GetPlayerlistbyName,
                    variables: {
                        where: {
                            _or: [
                                {
                                    firstName: {
                                        _ilike: '%' + FirstName + '%',
                                    },
                                },
                                {
                                    lastName: {
                                        _ilike: '%' + LastName + '%',
                                    },
                                },
                            ],
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }
    getPlayerlistbyNameClubWise(
        clubId: string,
        FirstName: string,
        LastName: string
    ): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .watchQuery<any>({
                    query: Query.getPlayerlistbyNameClubWise,
                    variables: {
                        where: {
                            membership: {
                                clubId: {
                                    _eq: clubId,
                                },
                            },
                            _or: [
                                {
                                    firstName: {
                                        _ilike: '%' + FirstName + '%',
                                    },
                                },
                                {
                                    lastName: {
                                        _ilike: '%' + LastName + '%',
                                    },
                                },
                            ],
                        },
                    },
                })
                .valueChanges.subscribe(({ data }) => {
                    resolve(data.player);
                });
        });
    }

    getPlayerTodayRound(playerId: string, Date: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.GetPlayerTodayRoundQL,
                    variables: {
                        playerId: playerId,
                        toDate: Date,
                    },
                })
                .subscribe(({ data }) => {
                    resolve(data.flight);
                });
        });
    }

    public getAllPlayersByCategory(): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe({
                    query: Query.AllPlayersByCategoryQL,
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

    public createTournamentMarshals(marshals: Marshal[]): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.createMarshalQL,
                    variables: {
                        objects: marshals,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        console.log(data);
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                        //console.log('Could not add due to ' + error);
                    }
                );
        });
    }

    getPlayerWHS(id: string): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.PlayerHandicapQuery,
                    variables: {
                        playerId: id,
                    },
                })
                .subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }
    getPlayerWHSRound(courseRating: any): Promise<any> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<any>({
                    query: Query.PlayerHandicapRoundQuery,
                    variables: {
                        courseId: courseRating.courseId,
                        courseHoleSets: courseRating.courseHoleSets,
                    },
                })
                .subscribe(({ data }) => {
                    resolve(data);
                });
        });
    }

    public getPlayerCategories(): Array<PlayerCategory> {
        const CLUB_CATEGORIES: PlayerCategory[] = [
            { id: 1, name: 'Amateurs' },
            { id: 2, name: 'Senior Amateurs' },
            { id: 3, name: 'Junior Amateurs' },
            { id: 4, name: 'Professionals' },
            { id: 5, name: 'Senior Professionals' },
            { id: 6, name: 'Junior Professionals' },
            { id: 7, name: 'Veterans' },
            { id: 8, name: 'Juniors' },
            { id: 9, name: 'Ladies' },
            { id: 10, name: 'Junior Ladies' },
            { id: 11, name: 'Pro-Am' },
            { id: 11, name: 'AGC Members & PAF Officers' },
        ];

        return CLUB_CATEGORIES;
    }
}
