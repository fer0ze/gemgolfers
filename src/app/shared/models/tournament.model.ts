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
    category?: string;
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
    STABLE_FORD = "STABLEFORD",
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
    GREENSOME = "GREENSOME",
    FOURSOME = "FOURSOME",
    TWO_BALL_BEST_BALL = "TWO_BALL_BEST_BALL",
    LIV = "LIV",
}

export enum matchFormats {
    MATCH_PLAY = "Ryder Cup",
    STROKE_PLAY = "Stroke Play",
    STABLE_FORD = "Stableford",
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
    GREENSOME = "GreenSome",
    FOURSOME = "FourSome",
    TWO_BALL_BEST_BALL = "Two Ball Best Ball",
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

export const INDIVIDUAL_FORMATS_INFO: Record<string, string> = {
    STROKE_PLAY: "Simply calculate the player gross score and net score as it comes.",

    STABLE_FORD: `Stableford Leaderboard is calculated on Net Score and points are awarded as below.

Simply calculate the player points after checking the net score on each hole.

Double Eagle: 5 points
Eagle: 4 points
Birdie: 3 points
Par: 2 points
Bogey: 1 point
Double Bogey or more: 0 points`,

    "STROKE_PLAY / STABLEFORD": `StrokePlay: Simply calculate the player gross score and net score as it comes.

Stableford: Stableford Leaderboard is calculated on Net Score and points are awarded:

Double Eagle: 5 points
Eagle: 4 points
Birdie: 3 points
Par: 2 points
Bogey: 1 point
Double Bogey or more: 0 points`,

    NASSAU: `It is a Matchplay format and is played on Net Score in a 4 ball...`,

    MODIFIED_STABLEFORD: `Modified Stableford Leaderboard is calculated on Net Score...`,

    SPLIT_SIXES: `Played on Net Score in a 3 ball group...`,

    RYDER_CUP: `Calculate the team score in two ways...`,

    SHAMBLES: `In Shambles, we have pairs...`,

    TWO_BALL_BEST_BALL: `In TWO Ball Best Ball, we have pairs...`,

    TEXAS_SCRAMBLE: `In Texas Scramble, we combine handicap...`,

    BEST_TWO: `BEST TWO and BEST THREE formats...`,

    BEST_THREE: `BEST TWO and BEST THREE formats...`,

    GREENSOME: "",

    FOURSOME: ""
};
