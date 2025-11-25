import { Club } from "./club.model";
import { Tournament } from "./tournament.model";

export interface Player {
    id: string;
    adminClubId: string;
    firebaseUid: string;
    fcmToken: string;
    gemId: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date;
    fullName?: string;
    picture: string;
    email: string;
    phone: string;
    playerCategory: string;
    handicap: number;
    online: boolean;
    countryCode: string;
    extraData: string;
    userRole: number;
    membershipNumber: string;
    membership: ClubMembership[];
    homeClubId?: string;
    handicapWhsIndex?: number;
    handicapIndexFreezeTill?: Date;
    playingTee?: string;
    tee_id?: number;
}

export interface UserSessionModel {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    club: any;
    courseId: string;
    phone: string;
    picture: string;
    clubId?: string;
    adminClubId?: string;
    roles?: { id: number; name: string }[];
    modules: { id: string; name: string }[];
}


export interface Marshal {
    id: string;
    tournamentId: string;
    email: string;
    password: string;
    dateValidTill: Date;
    firstHole: number;
    lastHole: number;
}

export interface PlayerHanidcap {
    playerId: string;
    tournamentId: string;
    handicap: number;
    oldHandicap: number;
    updatedAt: Date;
    score: number;
}

export interface handicap_change_log {
    id: string
    playerId: string;
    oldHandicap: number;
    newHandicap: number;
    whs: boolean;
    dateTime: string;
    remarks: string;
    tournamentId: string;
    updaterId: string;
}

export interface PlayerWHSHanidcap {
    playerId: string;
    tournamentId: string;
    round: number;
    handicapDifferential: number;
    updatedAt: Date;
    playedAt: Date;
    score: string;
    adjustedScore: string
}

export interface IPlayerHandicapWhs {
    playerId: string;
    round: number;
    handicapDifferential: number;
    updatedAt: Date;
    playedAt: Date;
    score: number;
    adjustedScore: number;
    front9: boolean;
    back9: boolean;
    PlayerQL: Player;
    tournamentQL: Tournament
}

export interface ClubMembership {
    clubId: string;
    playerId: string;
    suspended: Boolean;
    club: Club
}

export interface PlayerCategory {
    id: number;
    name: string;
}

export interface CourseTee {
    id: string;
    name: string;
}

export interface TournamentMemberStatus {
    tournamentId: string;
    playerId: string;
    status: string;
    attendance: boolean;
}

export interface TournamentRoleManager {
    tournamentId: string;
    playerId: string;
    updateTournament: boolean;
    changeFlights: boolean;
    enterScores: boolean;
}

export enum MemberStatus {
    DISQUALIFIED = "dq",
    COMPLETED = "co",
    INCOMPLETE = "ic",
}

export enum enumPlayerCategory {
    PROFESSIONALS = "Professionals",
    AMATEURS = "Amateurs",
    LADIES = "Ladies",
}