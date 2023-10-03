
import { FacadeService } from 'app/shared/services/facade.service';
import { LeaderType } from '../classes/leader';
import { Player, enumPlayerCategory } from '../models/player.model';
import { Score } from '../classes/score';
import { handicapAllocation } from '../classes/general';
import { HandicapAllocation } from '../models/tournament.model';

export class PlayersScoreLoader {

    private facadeService: FacadeService;
    private tournamentId: string = '';
    private playerId: string = '';
    private netscores: any[] = [];
    private grossscores: any[] = [];
    private matchscores: any[][] = [];
    private courseHoleSetsInverted: string = '';
    private round: string = '';

    constructor(facadeService: FacadeService, tournamentId: string, playerId: string) {
        this.facadeService = facadeService;
        this.tournamentId = tournamentId;
        this.playerId = playerId;
    }

    public async fetchTournamentScores() {

        //console.log(this.tournament);
        //console.log(this.roundPlayerScores);


        let tournamentScoresQuery = await this.facadeService.getTorunamentScoreQuery(this.tournamentId);
        let tournamentQL = tournamentScoresQuery.TournamentQL;
        //console.log(tournamentQL);
        if (tournamentQL != null) {
            let flightsQLs = tournamentQL.FlightsQL;
            let handicapAllocation: string = this.getHandicapAllocation(tournamentQL.handicapAllocations);
            let CourseQL=tournamentQL.CourseQL;


            //console.log(flightsQLs);
            for (let flightData of flightsQLs) {
                ////console.log("Flight ID: " + flightData.id);
                let membersQLs: any = flightData.MembersQL;

                for (let membersQL of membersQLs) {
                    ////console.log(membersQL);
                    let playerId: String = membersQL.playerId;
                    //let playerQL:Player = membersQL.PlayerQL;
                    if (playerId !== this.playerId) {
                        continue
                    }
                    //this.players.push(playerQL);

                    let player: Player = membersQL.PlayerQL;
                    ////console.log(player);
                    if (player == null) {
                        continue;
                    }

                    let grossTotal: number = 0;
                    let netTotal: number = 0;
                    let grossUnderTotal: number = 0;
                    let netUnderTotal: number = 0;
                    let stableFordPointsTotal: number = 0;
                    let handicap: number = 0;
                    let scoreHandicap: number = 0;
                    let holesPlayed: number = 0;
                    let flightIds: String[] = [];
                    let cntr: number = 0;

                    let scores: any[] = membersQL.ScoresQL;

                    //if (scores.length <= 0) continue;

                    for (let score of scores) {
                        let objScore: Score = new Score(
                            score.playerId,
                            score.playerHandicap,
                            score.HoleIPQL.index,
                            score.HoleIPQL.par,
                            score.grossScore
                        );
                        let gross: number = score.grossScore;

                        if (gross <= 0) {
                            continue;
                        }

                        grossTotal += gross;
                        let currentNet: number =
                            objScore.getNetScore(handicapAllocation);
                        scores[cntr]['netScore'] = currentNet;

                        grossUnderTotal += objScore.getGrossUnder();
                        //netUnderTotal = netUnderTotal + objScore.getNetUnder(handicapAllocation);
                        stableFordPointsTotal +=
                            objScore.getStablefordPoints(handicapAllocation);
                        handicap += objScore.getPlayerHandicap(handicapAllocation);
                        scoreHandicap =
                            objScore.getPlayerHandicap(handicapAllocation);
                        holesPlayed++;

                        if (!flightIds.includes(score.flightId)) {
                            flightIds.push(score.flightId);
                        }
                        cntr++;

                        //if(player.id == "-L6192uVBlBFw3grUy9_")
                        ////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.hole.holeNo);
                    }

                    let playerHole18ScoreGross: any[] = [];
                    let playerHole18ScoreNet: any[] = [];

                    for (let i = 0; i < CourseQL.noOfHoles; i++) {
                        let hole = scores.find((a) => {
                            return a.HoleIPQL.holeNo == i + 1;
                        });

                        if (hole) {
                            playerHole18ScoreGross[i] = hole.grossScore;
                            playerHole18ScoreNet[i] = hole.netScore;
                        } else {
                            playerHole18ScoreGross[i] = 0;
                            playerHole18ScoreNet[i] = 0;
                        }
                    }

                    ////console.log(scoreHandicap + " " + player.handicap);
                    netTotal = grossTotal - scoreHandicap;
                    // //console.log(netTotal);
                    netUnderTotal = grossUnderTotal - scoreHandicap;

                    let name: string = player.firstName + ' ' + player.lastName;
                    let picture: string = player.picture;
                    if (
                        holesPlayed <= 0 ||
                        (handicap <= 0 &&
                            player.playerCategory !=
                            enumPlayerCategory.PROFESSIONALS)
                    ) {
                        //handicap = player.getHandicap(handicapAllocation); // need to be discuss with zain bhai will it be the same as objScore.getPlayerHandicap
                        handicap = player.handicap;
                    } else {
                        handicap = handicap / holesPlayed;
                    }
                    if (handicapAllocation == HandicapAllocation.AS_IS) {
                        handicap = Math.round(handicap);
                    }
                    // let status: any = this.memberStatusesQLs.find(
                    //   (s) => s.playerId === playerId
                    // );

                    let extraData: string = player.extraData;
                    let completed: boolean =
                        holesPlayed > 0 &&
                        holesPlayed >= 18 * flightIds.length;

                    let LeaderGross: any = {
                        position: 0,
                        tied: false,
                        courseId: flightData.courseId,
                        holeSets: flightData.courseHoleSets,
                        holeSetsInverted: flightData.courseHoleSetsInverted
                            ? flightData.courseHoleSetsInverted
                            : false,
                        playerId: playerId,
                        name: name,
                        picture: picture,
                        playingRound: flightData.flightRound,
                        handicap: handicap,
                        score: grossTotal,
                        type: LeaderType.GROSS,

                        holeScores: playerHole18ScoreGross,

                    };
                    let LeaderNet: any = {
                        courseId: flightData.courseId,
                        holeSets: flightData.courseHoleSets,
                        holeSetsInverted: flightData.courseHoleSetsInverted
                            ? flightData.courseHoleSetsInverted
                            : false,
                        name: name,
                        picture: picture,
                        handicap: handicap,
                        score: netTotal,
                        playingRound: flightData.flightRound,
                        type: LeaderType.NET,
                        status: 0,
                        extraData: extraData,
                        under: netUnderTotal,
                        points: stableFordPointsTotal,
                        holes: holesPlayed,
                        completed: completed,
                        holeScores: playerHole18ScoreNet,

                    };

                    this.grossscores.push(LeaderGross);
                    this.netscores.push(LeaderNet);
                    //this.calculateTotal(LeaderGross, LeaderNet, round);
                }
            }
        }
    }
    public getStrokePlayScore(playerId:string,round:any){
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];
        playerGrossScore = this.grossscores.filter((g) => {
            return g.playerId == playerId;
        });

        playerNetScore = this.netscores.filter((g) => {
            return g.playerId == playerId;
        });
        return {
            grossScore:playerGrossScore,
            netScore:playerNetScore,
        }
    }
    public getHandicapAllocation(handicapAllocations): string {
        let hcAllocation: string;

        if (handicapAllocations)
            hcAllocation = handicapAllocations['handicapAllocation'];
        else hcAllocation = handicapAllocation.AS_IS;

        return hcAllocation;
    }
   
}