import { Player, Marshal } from "./player.model";
import { Flight } from "./flight.model";

export class Tournament {
    id: string;
    clubId: string;
    leagueId: string; // null
    courseId: string;
    adminId: string;
    title: string;
    prefix: string;
    courseHoleSets: number; // 1, 2, 4, 8 any two selected numbers will be sum
    teamMatch: boolean; // false
    pairsMatch: boolean; // false
    interLeague: boolean; // false
    publicTournament: boolean; // add new checkbox field into the form
    confirmParticipants: boolean; // false
    noOfRounds: number;
    activeRound: number;
    matchFormat: string;
    pointsFormats: string | any; // null
    pointsValues: string | any; // null
    handicapAllocations: string; // null
    tee: string; // BLUE
    scoreManagement: string;
    startDate: Date;
    endDate: Date;
    approved?: boolean;
    tee_id: number;
    started: boolean; // true
    invited: boolean; // false
    singleRound: boolean; //false
    sponsorName: string; // ""
    sponsorLogo: string; // ""
    mobileLogoUrl: string;
    webLogoUrl: string;
    courseHoleSetsInverted: boolean;
    categories: TournamentCategory[];
    marshals: Marshal[];
    flights: Flight[];
    playingOnWhs: boolean;
    members: TournamentMember[];
    flightsCategory: FlightsCategory[];
    createdAt?: string;
    tournamentFlight?: boolean
}

export class FlightsCategory {
    id: string;
    noOfPlayers: number;
    flightsInterval: number;
    flightsTime: Date;
    arrangeBy: string;
    startingHole: string;
    scoreManagement: string;
    marshalsStartwith: string[];
    noOfMarshals: number;
    playingDate: PlayingDate[];
    categories: TournamentCategory[];
}

export class PlayingDate {
    id: string;
    noOfHoles: string;
    dates: string;
    playing: boolean;
}

export class TournamentCategory {
    id: string;
    tournamentId: string;
    category: string;
    handicapLimits: JSON;
    prizeInformation: JSON;
    flightSettings: JSON;
    default?: Boolean;
}
export class TournamentRoundCourses {
    tournamentId?: string;
    round: number;
    courseId: string;
    courseHoleSets: number;
    inverted: boolean;
}

export class TournamentMember {
    tournamentId: string;
    playerId: string;
    status: boolean;
}

export enum HandicapAllocation {
    THREE_FOURTH = "THREE_FOURTH",
    AS_IS = "AS_IS",
    HALF = "HALF",
    ONE_FOURTH = "ONE_FOURTH",
    ONE_TENTH = "ONE_TENTH",
    ONE_TENTH_DEC = "ONE_TENTH_DEC",
}

export enum matchFormat {
    MATCH_PLAY = "MATCH_PLAY",
    STROKE_PLAY = "STROKE_PLAY",
    STABLEFORD = "STABLEFORD",
    MODIFIED_STABLEFORD = "MODIFIED_STABLEFORD",
    SPLIT_SIXES = "SPLIT_SIXES",
    TEXAS_SCRAMBLE = "TEXAS_SCRAMBLE",
    TWO_BALL_SCRAMBLE = "TWO_BALL_SCRAMBLE",
    THREE_BALL_SCRAMBLE = "THREE_BALL_SCRAMBLE",
    FOUR_BALL_SCRAMBLE = "FOUR_BALL_SCRAMBLE",
    BEST_THREE = "BEST_THREE",
    BEST_TWO = "BEST_TWO",
    COMBINE_ALL = "COMBINE_ALL",
    BESTBALL = "BESTBALL",
    SHAMBLES = "SHAMBLES",
    LIV = "LIV",
}

export enum matchFormats {
    MATCH_PLAY = "Match Play",
    STROKE_PLAY = "Stroke Play",
    STABLEFORD = "Stableford",
    MODIFIED_STABLEFORD = "Modified Stableford",
    SPLIT_SIXES = "Split Sixes",
    TEXAS_SCRAMBLE = "Texas Scramble",
    TWO_BALL_SCRAMBLE = "Two Ball Scramble",
    THREE_BALL_SCRAMBLE = "Three Ball Scramble",
    FOUR_BALL_SCRAMBLE = "Four Ball Scramble",
    BEST_THREE = "Best Three",
    BEST_TWO = "Best Two",
    COMBINE_ALL = "Combine All",
    BESTBALL = "Bestball",
    SHAMBLES = "Shambles",
    LIV = "LIV",
}

export enum TexasScrampleTeamSize {
    FOURH = 4,
    THREE = 3,
    TWO = 2,
}

export interface TournamentRounds {
    Text: String;
    Value: number;
}

export interface TournamentPair {

    id: String;
    flightId: String;
    tournamentId: String;

    pairName: String;

    player1: Player;
    player2: Player;

}

export interface LeaderboardAd {

    tournamentId: String;
    ad: String;
    firstRow: number;
    repetitionInterval: number;

}

export interface DailyRound {
    clubId: String;
    startDate: String;
}

export interface AddDailyRound {
    holeSets: String;
    //startingHole: String;
    startingTime: Date;
    roundTee: String;
    roundDate: Date;
    //addPlayer : Player;
}