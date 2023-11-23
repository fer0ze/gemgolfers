import { Time } from "@angular/common";

export interface Flight {
    id: string;
    tournamentId: string;
    courseId: string;
    adminId: string;
    courseHoleSets: number;
    flightNo: number;
    flightRound: number;
    categoryRound: number;
    startingHole: number
    tee: string;
    date: Date;
    time: Time;
    ended: boolean;
    category: string;
    members: FlightMembers[];
    pairs?: any[];
}

export interface FlightMembers {
    flightId: string;
    playerId: string;
    attendance: boolean;
    playingTee: string;
    tee_id: number;
    playingHandicap?: number;
    guest?: boolean;
    playingHandicapWhs?: number;
}
