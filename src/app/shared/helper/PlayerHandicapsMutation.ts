import { PlayerHandicapWhs } from 'app/shared/classes/player-hanidcap-whs';

import { Player, IPlayerHandicapWhs } from 'app/shared/models/player.model';
import { Tournament } from 'app/shared/models/tournament.model';
import { Flight } from 'app/shared/models/flight.model';
import { Course, CourseRating } from 'app/shared/models/course.model';
import { Hole } from 'app/shared/models/hole.model';
import { Score } from 'app/shared/models/score.model';
import { FlightManagerQL } from '../fragments/flight.fragment';
import { FacadeService } from '../services/facade.service';


export class PlayerHandicapsMutation {

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

    public setParams(playerIds: string[], playingDate: Date) {
        this.playerIds = playerIds;
        this.playingDate = playingDate;
        this.fetchData();
    }

    public getPlayerWhsHandicapHistory(playerId: string) : Map<string, any> {
        return this.playersHandicapWhs.get(playerId);
    }

    private async fetchData() {
        if (this.playerIds == null || this.playerIds.length || this.playingDate == null) {
            return;
        }

        let playerHistoryQuery = await this.facadeService.getPlayersHandicapWhsHistory(this.playerIds, this.playingDate);
        console.log(playerHistoryQuery);
        let playerHandicapData = playerHistoryQuery.PlayerQL;
        if (playerHandicapData != null) {
            this.playersHandicapWhs.clear();
            
            for (let playerQL of playerHandicapData) {
                let playerId: string = playerQL.id;
                let playerHandicapsWhs: any[] = [];
                let handicapHistoryWhsQLs = playerQL.HandicapHistoryWhsQL;
                for (let playerHandicapWhs of handicapHistoryWhsQLs) {
                    playerHandicapsWhs.push(playerHandicapWhs);
                }
                this.playersHandicapWhs.set(playerId, playerHandicapsWhs);
            }
            
        } else {
            console.log("Received null query response. Please try again.");
        }
        
    }

}
