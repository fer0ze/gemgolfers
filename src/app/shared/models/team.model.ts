import { Player } from "./player.model";

export interface Team {
    id: string;
    tournamentId: string;
    adminId: string;
    name: string;
    color: string;
}

export interface TeamMatchResult {

    matchTitle: string;
    teamA: Team;
    teamB: Team;
    playersTeamA: Player[];
    playersTeamB: Player[];

    finalResult: TeamResult;

    upScore: number;
    remainingHoles: number;
    scoresTeamA: number[];
    scoresTeamB: number;
    resultColor: string;
    flightResultText: string;
}

export interface TeamMatchAllResult {

    matchTitle: string;
    totalTeamA: number;
    totalTeamB: number;
    resultColor: string;
}

export enum TeamResult {
    NOT_SET = 0,
    A_WON = 1,
    B_WON = 2,
    DRAW = 3,
}

export enum TeamScoreFormat {
    All = 0,
    FOUR_BALL = 1,
    SINGLE = 2,
}