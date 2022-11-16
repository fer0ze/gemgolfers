import { PlayerHandicapWhs } from 'src/app/shared/classes/player-hanidcap-whs';
import { CourseRating } from 'src/app/shared/classes/course-rating';

import { FacadeService } from '../services/facade.service';
import { Course } from '../classes/course';

export class PlayersWhsHandicapHistoryLoader {

    private playerIds: string[];
    private playingDate: Date;

    private playersHandicapWhs: Map<string, any>;

    private facadeService: FacadeService;

    //private ApolloCall<TournamentScoresQuery.Data> tournamentScoresCall;

    constructor(facadeService: FacadeService) {
        
        this.playersHandicapWhs = new Map<string, any>();
        this.facadeService = facadeService;
    }

    public resetParams() {
        this.playerIds = [];
    }

    public async setParams(playerIds: string[], playingDate: Date) {
        console.log(playerIds);
        console.log(playingDate);
        this.playerIds = playerIds;
        this.playingDate = playingDate;
        
        await this.fetchData();
    }

    public getPlayerWhsHandicapHistory(playerId: string) : Array<PlayerHandicapWhs> {
        let playerHandicapsWhs: Array<PlayerHandicapWhs> = this.playersHandicapWhs.get(playerId);
        if (playerHandicapsWhs == null) {
            return null;
        }
        let handicapsWhs: Array<PlayerHandicapWhs> = [];
        for (let playerHandicapWhs of playerHandicapsWhs) {
            handicapsWhs.push(playerHandicapWhs);
        }
        return handicapsWhs;
    }

    private async fetchData() {
        console.log(this.playerIds + " - - - " + this.playerIds.length);
        if (this.playerIds == null || this.playerIds.length == 0 || this.playingDate == null) {
            console.log("return me");
            return;
        }
        console.log("getting player history");
        let playerHistoryQuery = await this.facadeService.getPlayersHandicapWhsHistory(this.playerIds, this.playingDate);
        console.log(playerHistoryQuery);
        if (playerHistoryQuery) {
            this.playersHandicapWhs.clear();
            let playerHandicapData = playerHistoryQuery.PlayerQL;
            if (playerHandicapData) {
                for (let playerQL of playerHandicapData) {
                    let playerId: string = playerQL.id;
                    let playerHandicapsWhs: PlayerHandicapWhs[] = [];
                    let handicapHistoryWhsQLs = playerQL.HandicapHistoryWhsQL;
                    console.log(playerQL);
                    for (let handicapHistoryWhsQL of handicapHistoryWhsQLs) {
                        let playerHandicapWhs: PlayerHandicapWhs = new PlayerHandicapWhs(playerId, handicapHistoryWhsQL.PlayerQL.firstName + " " + handicapHistoryWhsQL.PlayerQL.lastName, handicapHistoryWhsQL.PlayerQL.handicap, handicapHistoryWhsQL.handicapDifferential, handicapHistoryWhsQL.updatedAt, handicapHistoryWhsQL.playedAt, handicapHistoryWhsQL.score, handicapHistoryWhsQL.adjustedScore, handicapHistoryWhsQL.front9, handicapHistoryWhsQL.back9);
                        let tournamentQL = handicapHistoryWhsQL.TournamentQL;
                        let courseQL = tournamentQL.CourseQL;
                        let course: Course = new Course(courseQL.courseRating, courseQL.slopeRating, courseQL.par);
                        let tee: string = tournamentQL.tee;
                        let courseHoleSets: number = tournamentQL.courseHoleSets;
                        let holeSets: number = courseHoleSets != null ? courseHoleSets : 0;
                        let rating: CourseRating = course.getRating(tee, holeSets);
                        if (rating == null) {
                            rating = new CourseRating(courseQL.id, tee, holeSets, course.getCourseRating(), course.getSlopeRating(), course.getPar());
                        }
                        playerHandicapWhs.setCourseRating(rating);
                        playerHandicapsWhs.push(playerHandicapWhs);
                    }
                    this.playersHandicapWhs.set(playerId, playerHandicapsWhs);
                }
                
            } else {
                console.log("Received null query response. Please try again.");
            }
        }
        
    }

}
