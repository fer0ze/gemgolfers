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

    STABLEFORD: `Stableford Leaderboard is calculated on Net Score and points are awarded as below.

Simply calculate the player points after checking the net score on each hole.

Double Eagle: 5 points
Eagle: 4 points
Birdie: 3 points
Par: 2 points
Bogey: 1 point
Double Bogey or more: 0 points`,

    STABLE_FORD: `Stableford Leaderboard is calculated on Net Score and points are awarded as below.

Simply calculate the player points after checking the net score on each hole.

Double Eagle: 5 points
Eagle: 4 points
Birdie: 3 points
Par: 2 points
Bogey: 1 point
Double Bogey or more: 0 points`,

    "STROKE_PLAY / STABLEFORD": `StrokePlay: Simply calculate the player gross score and net score as it comes.

Stableford: Stableford Leaderboard is calculated on Net Score and points are awarded as below.

Simply calculate the player points after checking the net score on each hole.

Double Eagle: 5 points
Eagle: 4 points
Birdie: 3 points
Par: 2 points
Bogey: 1 point
Double Bogey or more: 0 points`,

    NASSAU: `It is a Matchplay format and is played on Net Score in a 4 ball, with 2 teams of 2 players each. With Singles Matchplay against both players of the other team and a 4 ball best ball between the teams. The following matches are in force:

- Front Nine Singles
- Front Nine Four Ball
- Back Nine Singles
- Back Nine Four Ball
- 18 Holes Singles
- 18 Holes Four Ball`,

    MODIFIED_STABLEFORD: `Modified Stableford Leaderboard is calculated on Net Score and points are awarded as below:

Simply calculate the player points after checking the net score on each hole.

Double Eagle: 8 points
Eagle: 5 points
Birdie: 2 points
Par: 0 points
Bogey: -1 point
Double Bogey or more: -3 points`,

    SPLIT_SIXES: `Played on Net Score in a 3 ball group, with 6 points awarded at each hole:

4 points for winner
2 points for 2nd position
0 points for 3rd position

In case 2 or 3 players have the same net score, the total points are equally divided. The player with the maximum points at the end of the round is the winner.`,

    RYDER_CUP: `Calculate the team score in two ways:

(1) Singles: Compare each team player's net score hole-wise with their opponent on the flight and give 1 point to the player with the lowest net score.

(2) 4 Ball: Calculate both teams' players' best net score on each hole in the flight, compare them, and award points according to the point allocation.`,

    SHAMBLES: `In Shambles, we have pairs. We calculate the gross score and net score by comparing each pair's player lowest score in the flight.`,

    TWO_BALL_BEST_BALL: `In TWO Ball Best Ball, we have pairs. We calculate the gross score and net score by comparing each pair's player lowest score in the flight.`,

    TEXAS_SCRAMBLE: `In Texas Scramble, we have a flight with names and one score for each hole on the flight. We then calculate the gross and net according to the handicap allocation.

We combine all players' handicaps then divide based on the number of players in the flight:
- 4 players: handicap = combinedHandicap / 10
- 3 players: handicap = combinedHandicap / 8
- 2 players: handicap = combinedHandicap / 6

Then convert the divided handicap according to the Handicap Allocation.`,

    BEST_TWO: `In BEST TWO format, we have teams. We calculate the gross under and net under total for each team player, select the lowest gross under of 2 players, and sum their gross under and net under to display on the leaderboard.`,

    BEST_THREE: `In BEST THREE format, we have teams. We calculate the gross under and net under total for each team player, select the lowest gross under of 3 players, and sum their gross under and net under to display on the leaderboard.`,

    GREENSOME: "A pairs format where both players tee off, then select the best drive. The player whose drive was not selected plays the second shot, and thereafter alternate shots until the hole is complete.",

    FOURSOME: "A pairs format where two players play as a team with one ball, taking alternate shots throughout the round. One player tees off on odd-numbered holes and the other on even-numbered holes."
};
