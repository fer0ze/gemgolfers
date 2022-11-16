import { PlayerHandicapWhs } from 'src/app/shared/classes/player-hanidcap-whs';

import { Player, IPlayerHandicapWhs } from 'src/app/shared/models/player.model';
import { Tournament } from 'src/app/shared/models/tournament.model';
import { Flight } from 'src/app/shared/models/flight.model';
import { Course } from 'src/app/shared/models/course.model';
import { CourseRating } from 'src/app/shared/classes/course-rating';
import { Hole } from 'src/app/shared/models/hole.model';
import { Score } from 'src/app/shared/models/score.model';
import { FlightManagerQL } from '../fragments/flight.fragment';

import { FacadeService } from '../services/facade.service';
import { stringify } from '@angular/core/src/util';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { General } from '../classes/general';

export class TournamentRoundScoresLoader {

    private tournament: Tournament;
    private course: Course;
    private holes: Hole[];

    private players = new Map<string, Player>(); //private final HashMap<String, Player> players;
    private playerScores = new Map<string, Score[]>();
    private roundPlayerScores: any[] = [];  //  private final SparseArray<HashMap<String, ArrayList<Score>>> roundPlayerScores;
    //private playerHandicaps = new Map<PlayerHandicapAllRounds, string>();  //private final HashMap<String, PlayerHandicapAllRounds> playerHandicaps;
    private playerHandicapWhs = new Map<string, PlayerHandicapWhs>();   //    private final SparseArray<HashMap<String, PlayerHandicapWhs>> playerHandicapsWhs;
    private playerHandicapsWhs: any[] = [];

    private flights = new Map<string, Flight>();   ///private final HashMap<String, Flight> flights;
    private flightMemberIds = new Map<string, string[]>();   ///private final HashMap<String, ArrayList<String>> flightMemberIds;

    private facadeService: FacadeService;

    constructor(tournament: Tournament, facadeService: FacadeService) {
        
        this.tournament = tournament;

        this.holes = [];
        this.players = new Map<string, Player>();
        this.roundPlayerScores = [];
        this.playerHandicapsWhs = [];

        let noOfRounds: number = tournament.noOfRounds;
        for (let i = 0; i <= noOfRounds; i++) {
            // this.roundPlayerScores.push(new Map<string, Score[]>());
            // this.playerHandicapsWhs.push(new Map<string, PlayerHandicapWhs>());
            this.roundPlayerScores[i] = new Map<string, Score[]>();
            this.playerHandicapsWhs[i] = new Map<string, PlayerHandicapWhs>();
        }

        this.flights = new Map<string, Flight>();
        this.flightMemberIds = new Map<string, string[]>();

        this.facadeService = facadeService;
    }

    public getTournament() : Tournament {
        return this.tournament;
    }

    public getCourseRating() : number {
        if (this.course != null) {
            return this.course.courseRating;
        }
        return 72;
    }

    public getCoursePar() : number {
        if (this.course != null) {
            return this.course.par;
        }
        return 72;
    }

    public getSlopeRating() : number {
        if (this.course != null) {
            return this.course.slopeRating;
        }
        return 113;
    }

    public getCourseRatingByFlight(flight: Flight) : CourseRating {
        if (this.course != null && flight != null) {
            //return this.course.getRating(flight.flightName.name, flight.courseHoleSets);
            
            if(this.course["CourseRatingsQL"]) {

                let courseRatingObj = this.course["CourseRatingsQL"];

                if(courseRatingObj.length == 0) return null;

                let selectedCourseRating = this.course["CourseRatingsQL"].find((a) => {
                    return a.tee == General.rayaToKgc(flight.tee) && a.courseHoleSets == flight.courseHoleSets;
                });

                if(!selectedCourseRating) return null;

                return new CourseRating(selectedCourseRating.courseId, selectedCourseRating.tee, selectedCourseRating.courseHoleSets, selectedCourseRating.courseRating, selectedCourseRating.slopeRating, selectedCourseRating.coursePar);
            }
            
        }
        return null;
    }

    public getHolesCopy() : Hole[] {
        let holesCopy: Hole[] = [];
        for (let hole of this.holes) {
            holesCopy.push(hole);
        }
        return holesCopy;
    }

    public getPlayers() : Map<string, Player> {
        return this.players;
    }

    public getPlayerScores(round: number) : Map<string, Score[]> {
        let playerScore: Map<string, Score[]> = (this.roundPlayerScores.length > 0)? this.roundPlayerScores[round] : null; //this.roundPlayerScores(round);
        //console.log(playerScore);
        if (playerScore == null) {
            playerScore = new Map<string, Score[]>();
            this.roundPlayerScores[round] =  playerScore; //this.roundPlayerScores.push(round, playerScore);
        }
        return playerScore;
    }

    public getPlayerHandicapsWhs(round: number) : Map<string, PlayerHandicapWhs>{
        let playerHandicaps: Map<string, PlayerHandicapWhs> = (this.playerHandicapsWhs.length > 0)? this.playerHandicapsWhs[round] : null; //playerHandicapsWhs.get(round);
        if (playerHandicaps == null) {
            playerHandicaps = new Map<string, PlayerHandicapWhs>();
            this.playerHandicapsWhs[round] = playerHandicaps; //this.playerHandicapsWhs.push(round, playerHandicaps);
        }
        return playerHandicaps;
    }

    public getPlayerFlight(playerId: string, flightRound: number) : Flight {
        let flight: Flight;
        let ids = new Map<string, string[]>();
        ids = this.flightMemberIds;
        
        ids.forEach((value: string[], key: string) => {
            if (value.indexOf(playerId) >= 0) {
                let matchedFlight: Flight = this.flights.get(key);
                if (matchedFlight != null && matchedFlight.flightRound == flightRound) {
                    flight = matchedFlight;
                    return;
                }
            }
        });

        return flight;
    }

    public async fetchTournamentScores() {

        //console.log(this.tournament);
        //console.log(this.roundPlayerScores);

        
        let tournamentScoresQuery = await this.facadeService.getTorunamentScoreQuery(this.tournament.id);
        let tournamentQL = tournamentScoresQuery.TournamentQL;
        this.tournament = tournamentQL;
        //console.log(tournamentQL);
        if (tournamentQL != null) {
            //tournament = QLModelMapper.tournamentQlToModel(tournamentQL.getFragments().getTournamentQL());
            let courseQL = this.course = tournamentQL.CourseQL;
            //course = QLModelMapper.courseQlToModel(courseQL.getFragments().getCourseQL());
            //console.log(this.course);
            this.holes = [];
            let holesQLs = courseQL.HolesQL;
            for (let holesQL of holesQLs) {
                this.holes.push(holesQL);
            }

            //console.log(this.holes);
            let memberHandicaps: Map<string, number> = null;
            let leagueQL = tournamentQL.LeagueQL;
            if (leagueQL != null) {
                memberHandicaps = new Map<string, number>();
                let leagueMemberHandicapsQLs: any = leagueQL.MembersQL;
                for (let memberHandicapsQL of leagueMemberHandicapsQLs) {
                    memberHandicaps.set(memberHandicapsQL.playerId, memberHandicapsQL.PlayerQL.handicap);
                }
            }
            this.players.clear();
            this.roundPlayerScores = [];
            this.flights.clear();
            this.flightMemberIds.clear();
            let flightsQLs = tournamentQL.FlightsQL;
            //console.log(flightsQLs);
            for (let flightsQL of flightsQLs) {
                
                let flight: Flight = flightsQL;
                let flightId: string = flight.id;
                this.flights.set(flightId, flight);
                let memberIds: string[] = [];
                let playerScores: Map<string, Score[]> = this.getPlayerScores(flight.flightRound);
                //console.log(playerScores);
                let membersQLs = flightsQL.MembersQL;
                for (let membersQL of membersQLs) {
                    let playerId: string = membersQL.playerId;
                    memberIds.push(playerId);

                    let playerQL = membersQL.PlayerQL;
                    let player: Player = playerQL;
                    if (memberHandicaps != null) {
                        let memberHandicap: number = memberHandicaps.get(player.id);
                        if (memberHandicap != null) {
                            player.handicap = memberHandicap;
                        }
                    }
                    this.players.set(playerId, player);

                    let scores: Score[] = (playerScores.size > 0 )? playerScores.get(playerId) : [];
                    if (scores == null) {
                        scores = [];
                        //playerScores.set(playerId, scores);
                    }

                    let scoresQLs = membersQL.ScoresQL;
                    for (let scoreQL of scoresQLs) {
                        let score: Score = scoreQL;
                        scores.push(score);
                    }

                    playerScores.set(playerId, scores);
                    //console.log(playerScores);
                    //console.log(flight.flightRound);
                    this.roundPlayerScores[flight.flightRound] = playerScores;
                    //console.log(this.roundPlayerScores);
                }
                this.flightMemberIds.set(flightId, memberIds);
                //console.log(this.flightMemberIds);
            }
            let noOfRounds: number = this.tournament.noOfRounds;
            let playerHandicapsWhsQLs = tournamentQL.PlayerHandicapsWhsQL;
            for (let playerHandicapsWhsQL of playerHandicapsWhsQLs) {
                //console.log(playerHandicapsWhsQL);
                let round: number = playerHandicapsWhsQL.round;
                
                let playerHandicapWhs: PlayerHandicapWhs = new PlayerHandicapWhs(playerHandicapsWhsQL.playerId, playerHandicapsWhsQL.PlayerQL.firstName + " " + playerHandicapsWhsQL.PlayerQL.lastName, playerHandicapsWhsQL.PlayerQL.handicap, playerHandicapsWhsQL.handicapDifferential, playerHandicapsWhsQL.updatedAt, playerHandicapsWhsQL.playedAt, playerHandicapsWhsQL.score, playerHandicapsWhsQL.adjustedScore, playerHandicapsWhsQL.front9, playerHandicapsWhsQL.back9, playerHandicapsWhsQL.handicapIndex);
                this.playerHandicapsWhs[round] = this.getPlayerHandicapsWhs(round).set(playerHandicapsWhsQL.playerId, playerHandicapWhs);
            }
            //console.log(this.playerHandicapsWhs);
           // console.log(this.roundPlayerScores);
        }
    }

    public getHandicapsWhsRounds() : any[] {
        return this.playerHandicapsWhs;
    }

}
