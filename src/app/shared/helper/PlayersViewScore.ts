import { FacadeService } from 'app/shared/services/facade.service';
import { LeaderType } from '../classes/leader';
import { Player, enumPlayerCategory } from '../models/player.model';
import { Score } from '../classes/score';
import { handicapAllocation } from '../classes/general';
import { HandicapAllocation, matchFormat } from '../models/tournament.model';

export class PlayersScoreLoader {
    private facadeService: FacadeService;
    private tournamentId: string = '';
    private playerId: string = '';
    private netscores: any[] = [];
    private grossscores: any[] = [];
    private team1Score: any[] = [];
    private team2Score: any[] = [];
    private matchscores: any[][] = [];
    private courseHoleSetsInverted: string = '';
    private round: string = '';

    constructor(
        facadeService: FacadeService,
        tournamentId: string,
        playerId: string
    ) {
        this.facadeService = facadeService;
        this.tournamentId = tournamentId;
        this.playerId = playerId;
    }

    public async fetchTournamentScores() {
        ////console.log(this.tournament);
        ////console.log(this.roundPlayerScores);

        let tournamentScoresQuery =
            await this.facadeService.getTorunamentScoreViewQuery(
                this.tournamentId
            );
        let tournamentQL = tournamentScoresQuery.TournamentQL;
        ////console.log(tournamentQL);
        if (tournamentQL != null) {
            if (tournamentQL.matchFormat === matchFormat.STROKE_PLAY || tournamentQL.matchFormat === matchFormat.LIV || tournamentQL.matchFormat === matchFormat.BEST_TWO || tournamentQL.matchFormat === matchFormat.BEST_THREE) {
                let calResult = this.strokePlayCalculation(tournamentQL);

            } else if (tournamentQL.matchFormat === matchFormat.STABLE_FORD || tournamentQL.matchFormat === matchFormat.MODIFIED_STABLEFORD || tournamentQL.matchFormat === matchFormat.SPLIT_SIXES) {
                let calResult = this.stableFordCalculation(tournamentQL);

            } else if (tournamentQL.matchFormat === matchFormat.MATCH_PLAY) {
                let calResult = this.matchPlayCalculation(tournamentQL);

            } else if (tournamentQL.matchFormat === matchFormat.TEXAS_SCRAMBLE) {
                let calResult = this.texasscrambleCalculation(tournamentQL);

            } else if (tournamentQL.matchFormat === matchFormat.FOUR_BALL_SCRAMBLE || tournamentQL.matchFormat === matchFormat.TWO_BALL_SCRAMBLE || tournamentQL.matchFormat === matchFormat.THREE_BALL_SCRAMBLE) {
                let calResult = this.scrambleCalculation(tournamentQL);

            } else if (tournamentQL.matchFormat === matchFormat.SHAMBLES || tournamentQL.matchFormat === matchFormat.GREENSOME || tournamentQL.matchFormat === matchFormat.TWO_BALL_BEST_BALL || tournamentQL.matchFormat === matchFormat.FOURSOME) {
                let calResult = this.shamblesCalculation(tournamentQL);

            }


        }
    }
    public getStrokePlayScore(playerId: string, round: any, teamMembersIds?: string[]) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];
        if (round == 0) {
            playerGrossScore = this.grossscores.filter((g) => {
                return g.playerId == playerId;
            });

            playerNetScore = this.netscores.filter((g) => {
                return g.playerId == playerId;
            });
            if (teamMembersIds && teamMembersIds.length > 0) {
                playerGrossScore = [];
                playerNetScore = [];
                playerGrossScore = this.grossscores.filter((g) => {
                    return teamMembersIds.includes(g.playerId);
                })

                playerNetScore = this.netscores.filter((g) => {
                    return teamMembersIds.includes(g.playerId);
                });
            }
        } else {
            playerGrossScore = this.grossscores.filter((g) => {
                return g.playerId == playerId && g.playingRound == round;
            });

            playerNetScore = this.netscores.filter((g) => {
                return g.playerId == playerId && g.playingRound == round;
            });
            if (teamMembersIds && teamMembersIds.length > 0) {
                playerGrossScore = [];
                playerNetScore = [];
                playerGrossScore = this.grossscores.filter((g) => {
                    return teamMembersIds.includes(g.playerId) && g.playingRound == round;
                })

                playerNetScore = this.netscores.filter((g) => {
                    return teamMembersIds.includes(g.playerId) && g.playingRound == round;
                });
            }
        }
        return {
            grossScore: playerGrossScore,
            netScore: playerNetScore,
        };
    }
    public getTexasScrambleScore(playerId: string) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];

        playerGrossScore = this.grossscores.filter(team => {
            return team.players.some(player => player.playerId === playerId)
        })


        playerNetScore = this.netscores.filter(team => {
            return team.players.some(player => player.playerId === playerId)
        })

        return {
            grossScore: playerGrossScore,
            netScore: playerNetScore,
        };
    }
    public getShamblesScore(playerId: string) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];

        playerGrossScore = this.grossscores

        playerNetScore = this.netscores

        return {
            grossScore: playerGrossScore,
            netScore: playerNetScore,
        };
    }
    public getMatchPlayScore(playerId: string) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];

        // playerGrossScore = this.grossscores.filter((g) => {
        //     return g.name == playerId;
        // });

        playerNetScore = this.netscores.filter((g) => {
            return g.playerId == playerId;
        });

        return {
            grossScore: playerGrossScore,
            netScore: playerNetScore,
        };
    }
    public getMatchPlayTeamScore(playerId: string) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];

        // playerGrossScore = this.grossscores.filter((g) => {
        //     return g.name == playerId;
        // });

        playerNetScore = this.team1Score.filter((g) => {
            return g.playerId == playerId;
        });
        if (playerNetScore.length == 0) {
            playerNetScore = this.team2Score.filter((g) => {
                return g.playerId == playerId;
            });
        }

        return {
            grossScore: playerGrossScore,
            netScore: playerNetScore,
        };
    }
    public getHandicapAllocation(handicapAllocations): string {
        let hcAllocation: string;

        if (handicapAllocations)
            hcAllocation = handicapAllocations['handicapAllocation'];
        else hcAllocation = handicapAllocation.AS_IS;

        return hcAllocation;
    }
    public strokePlayCalculation(tournamentQL) {
        let flightsQLs = tournamentQL.FlightsQL;
        let handicapAllocation: string = this.getHandicapAllocation(
            tournamentQL.handicapAllocations
        );
        let CourseQL = tournamentQL.CourseQL;

        ////console.log(flightsQLs);
        for (let flightData of flightsQLs) {
            //////console.log("Flight ID: " + flightData.id);
            let membersQLs: any = flightData.MembersQL;

            for (let membersQL of membersQLs) {
                //////console.log(membersQL);
                let playerId: String = membersQL.playerId;
                //let playerQL:Player = membersQL.PlayerQL;
                // if (playerId !== this.playerId) {
                //     continue;
                // }
                //this.players.push(playerQL);

                let player: Player = membersQL.PlayerQL;
                //////console.log(player);
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
                    handicap +=
                        objScore.getPlayerHandicap(handicapAllocation);
                    scoreHandicap =
                        objScore.getPlayerHandicap(handicapAllocation);
                    holesPlayed++;

                    if (!flightIds.includes(score.flightId)) {
                        flightIds.push(score.flightId);
                    }
                    cntr++;

                    //if(player.id == "-L6192uVBlBFw3grUy9_")
                    //////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.hole.holeNo);
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

                //////console.log(scoreHandicap + " " + player.handicap);
                netTotal = grossTotal - scoreHandicap;
                // ////console.log(netTotal);
                netUnderTotal = grossUnderTotal - scoreHandicap;

                let name: string = player.firstName + ' ' + player.lastName;
                if (
                    tournamentQL.matchFormat ==
                    matchFormat.TEXAS_SCRAMBLE ||
                    tournamentQL.matchFormat ==
                    matchFormat.THREE_BALL_SCRAMBLE ||
                    tournamentQL.matchFormat ==
                    matchFormat.THREE_BALL_SCRAMBLE
                ) {
                    name = flightData.name['name'];
                }

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
                    holesPlayed > 0 && holesPlayed >= 18 * flightIds.length;

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
                    players: membersQLs,
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
                    playerId: playerId,
                    players: membersQLs,
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
    public stableFordCalculation(tournamentQL) {
        let flightsQLs = tournamentQL.FlightsQL;
        let handicapAllocation: string = this.getHandicapAllocation(
            tournamentQL.handicapAllocations
        );
        let CourseQL = tournamentQL.CourseQL;

        ////console.log(flightsQLs);
        for (let flightData of flightsQLs) {
            //////console.log("Flight ID: " + flightData.id);
            let membersQLs: any = flightData.MembersQL;

            for (let membersQL of membersQLs) {
                //////console.log(membersQL);
                let playerId: String = membersQL.playerId;
                //let playerQL:Player = membersQL.PlayerQL;
                if (playerId !== this.playerId) {
                    continue;
                }
                //this.players.push(playerQL);

                let player: Player = membersQL.PlayerQL;
                //////console.log(player);
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
                    handicap +=
                        objScore.getPlayerHandicap(handicapAllocation);
                    scoreHandicap =
                        objScore.getPlayerHandicap(handicapAllocation);
                    holesPlayed++;

                    if (!flightIds.includes(score.flightId)) {
                        flightIds.push(score.flightId);
                    }
                    cntr++;

                    //if(player.id == "-L6192uVBlBFw3grUy9_")
                    //////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.hole.holeNo);
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

                //////console.log(scoreHandicap + " " + player.handicap);
                netTotal = grossTotal - scoreHandicap;
                // ////console.log(netTotal);
                netUnderTotal = grossUnderTotal - scoreHandicap;

                let name: string = player.firstName + ' ' + player.lastName;
                if (
                    tournamentQL.matchFormat ==
                    matchFormat.TEXAS_SCRAMBLE ||
                    tournamentQL.matchFormat ==
                    matchFormat.THREE_BALL_SCRAMBLE ||
                    tournamentQL.matchFormat ==
                    matchFormat.THREE_BALL_SCRAMBLE
                ) {
                    name = flightData.name['name'];
                }

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
                    holesPlayed > 0 && holesPlayed >= 18 * flightIds.length;

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
                    players: membersQLs,
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
                    playerId: playerId,
                    score: netTotal,
                    players: membersQLs,
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
    public scrambleCalculation(tournamentQL) {
        let flightsQLs = tournamentQL.FlightsQL;
        let handicapAllocation: string = this.getHandicapAllocation(
            tournamentQL.handicapAllocations
        );
        let CourseQL = tournamentQL.CourseQL;

        ////console.log(flightsQLs);
        for (let flightData of flightsQLs) {
            ////console.log(flightData);

            let membersQLs: any = flightData.MembersQL;
            let grossTotal: number = 0;
            let netTotal: any = 0;
            let grossUnderTotal: number = 0;
            let netUnderTotal: any = 0;
            let playerCategory: string = '';
            let handicap: number = 0;
            let combinedHandicap: number = 0;
            let scoreHandicap: number = 0;
            let holesPlayed: number = 0;
            let scores: any[];

            membersQLs.sort((a, b) => {
                // Check if ScoresQL has elements
                if (a.ScoresQL.length === 0 && b.ScoresQL.length === 0) {
                    return 0; // Both arrays are empty, consider them equal
                } else if (a.ScoresQL.length === 0) {
                    return 1; // a.ScoresQL is empty, b should come first
                } else if (b.ScoresQL.length === 0) {
                    return -1; // b.ScoresQL is empty, a should come first
                } else {
                    return a.ScoresQL[0].playerHandicap - b.ScoresQL[0].playerHandicap;
                }
            });
            membersQLs.map((member, index) => {
                let percentage = 80;
                if (tournamentQL.matchFormat !== matchFormat.SHAMBLES) {
                    if (index === 0 && tournamentQL.matchFormat == matchFormat.TWO_BALL_SCRAMBLE) {
                        percentage = 35;
                    } else if (index === 0) {
                        percentage = 20;
                    } else if (index === 1) {
                        percentage = 15;
                    } else if (index === 2) {
                        percentage = 10;
                    } else if (index === 3) {
                        percentage = 5;
                    } else {
                        percentage = 0; // All other players get 0% combined handicap
                    }
                }
                const playerHandicap = member.ScoresQL.length > 0 ? member.ScoresQL[0].playerHandicap : 0;
                const combinedHandicaps = (percentage / 100) * playerHandicap;
                combinedHandicap += combinedHandicaps;
                scores = member['ScoresQL'];
            });

            let flightIds: String[] = [];
            let cntr: number = 0;

            if (scores.length <= 0) continue;
            ////console.log(scores);

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
                let currentNet: number = objScore.getScrambleNetScore(
                    membersQLs.length,
                    Math.round(combinedHandicap)
                );
                scores[cntr]['netScore'] = currentNet;

                grossUnderTotal += objScore.getGrossUnder();
                //netUnderTotal = netUnderTotal + objScore.getNetUnder(handicapAllocation);
                handicap += objScore.getPlayerHandicap(handicapAllocation);
                holesPlayed++;

                if (!flightIds.includes(score.flightId)) {
                    flightIds.push(score.flightId);
                }
                cntr++;
            }

            let playerHole18ScoreGross: any[] = [];
            let playerHole18ScoreNet: any[] = [];
            if (flightData.courseHoleSets == 12) {
                for (let i = 0; i < CourseQL.noOfHoles; i++) {
                    let hole = scores.find((a) => {
                        return a.HoleIPQL.holeNo == i + 1;
                    });
                    ////console.log(hole);

                    if (hole) {
                        playerHole18ScoreGross[i] = hole.grossScore;
                        playerHole18ScoreNet[i] = hole.netScore;
                    } else {
                        playerHole18ScoreGross[i] = 0;
                        playerHole18ScoreNet[i] = 0;
                    }
                }
            } else {
                for (let i = 0; i < 18; i++) {
                    let hole = scores.find((a) => {
                        return a.HoleIPQL.holeNo == i + 1;
                    });
                    ////console.log(hole);

                    if (hole) {
                        playerHole18ScoreGross[i] = hole.grossScore;
                        playerHole18ScoreNet[i] = hole.netScore;
                    } else {
                        playerHole18ScoreGross[i] = 0;
                        playerHole18ScoreNet[i] = 0;
                    }
                }
            }

            //////console.log(scoreHandicap + " " + grossTotal);
            netTotal = grossTotal - Math.round(combinedHandicap);;

            ////console.log(netTotal);
            netUnderTotal = grossUnderTotal - Math.round(combinedHandicap);;

            let name: string = flightData.name['name'];
            handicap = Math.round(combinedHandicap);;
            let completed: boolean =
                holesPlayed > 0 &&
                holesPlayed >= 18 * flightIds.length;

            let LeaderGross: any = {
                playerId: flightData.id,
                name: name,
                picture: '',
                handicap: scoreHandicap,
                score: grossTotal,
                type: LeaderType.GROSS,
                status: status ? 1 : 0,
                extraData: '',
                under: grossUnderTotal,
                points: '',
                holes: holesPlayed,
                completed: completed,
                players: membersQLs,
                holeScores: playerHole18ScoreGross,

            };

            if (handicapAllocation == HandicapAllocation.ONE_TENTH) {
                netTotal = Math.round(netTotal);
                netUnderTotal = Math.round(netUnderTotal);
            } else if (handicapAllocation == HandicapAllocation.ONE_TENTH_DEC) {
                netTotal = netTotal.toFixed(1);
                netUnderTotal = netUnderTotal.toFixed(1);
            } else {
                netTotal = netTotal;
            }
            let LeaderNet: any = {

                playerId: flightData.id,
                name: name,
                picture: '',
                handicap: scoreHandicap,
                score: netTotal,
                type: LeaderType.NET,
                status: status ? 1 : 0,
                extraData: '',
                under: netUnderTotal,
                points: '',
                holes: holesPlayed,
                completed: completed,
                players: membersQLs,
                holeScores: playerHole18ScoreNet,

            };

            this.grossscores.push(LeaderGross);
            this.netscores.push(LeaderNet);
        }
    }
    public texasscrambleCalculation(tournamentQL) {
        let flightsQLs = tournamentQL.FlightsQL;
        let handicapAllocation: string = this.getHandicapAllocation(
            tournamentQL.handicapAllocations
        );
        let CourseQL = tournamentQL.CourseQL;

        ////console.log(flightsQLs);
        for (let flightData of flightsQLs) {
            ////console.log(flightData);

            let membersQLs: any = flightData.MembersQL;
            let grossTotal: number = 0;
            let netTotal: any = 0;
            let grossUnderTotal: number = 0;
            let netUnderTotal: any = 0;
            let playerCategory: string = '';
            let handicap: number = 0;
            let combinedHandicap: number = 0;
            let scoreHandicap: number = 0;
            let holesPlayed: number = 0;
            let scores: any[];

            for (let membersQL of membersQLs) {
                let player = membersQL.PlayerQL;

                if (player == null) {
                    continue;
                }
                if (membersQL['ScoresQL'].length > 0) {
                    combinedHandicap += membersQL['ScoresQL'][0].playerHandicap
                        ? membersQL['ScoresQL'][0].playerHandicap
                        : 0;
                } else {
                    combinedHandicap += 0;
                }
                // ////console.log("combined-> " + combinedHandicap);
                // playerCategory = player.playerCategory;

                scores = membersQL['ScoresQL'];
            }

            let flightIds: String[] = [];
            let cntr: number = 0;

            if (scores.length <= 0) continue;
            ////console.log(scores);

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
                let currentNet: number = objScore.getTexasScrambleNetScore(
                    membersQLs.length,
                    combinedHandicap
                );
                scores[cntr]['netScore'] = currentNet;

                grossUnderTotal += objScore.getGrossUnder();
                //netUnderTotal = netUnderTotal + objScore.getNetUnder(handicapAllocation);
                handicap += objScore.getPlayerHandicap(handicapAllocation);
                //////console.log(membersQLs.length + "<<.>>" + combinedHandicap);
                // if(handicapAloc==handicapAllocation.)
                scoreHandicap = objScore.getPlayerTSHandicaps(
                    handicapAllocation,
                    membersQLs.length,
                    combinedHandicap
                );
                //////console.log(scoreHandicap);

                holesPlayed++;

                if (!flightIds.includes(score.flightId)) {
                    flightIds.push(score.flightId);
                }
                cntr++;
            }

            let playerHole18ScoreGross: any[] = [];
            let playerHole18ScoreNet: any[] = [];
            if (flightData.courseHoleSets == 12) {
                for (let i = 0; i < CourseQL.noOfHoles; i++) {
                    let hole = scores.find((a) => {
                        return a.HoleIPQL.holeNo == i + 1;
                    });
                    ////console.log(hole);

                    if (hole) {
                        playerHole18ScoreGross[i] = hole.grossScore;
                        playerHole18ScoreNet[i] = hole.netScore;
                    } else {
                        playerHole18ScoreGross[i] = 0;
                        playerHole18ScoreNet[i] = 0;
                    }
                }
            } else {
                for (let i = 0; i < 18; i++) {
                    let hole = scores.find((a) => {
                        return a.HoleIPQL.holeNo == i + 1;
                    });
                    ////console.log(hole);

                    if (hole) {
                        playerHole18ScoreGross[i] = hole.grossScore;
                        playerHole18ScoreNet[i] = hole.netScore;
                    } else {
                        playerHole18ScoreGross[i] = 0;
                        playerHole18ScoreNet[i] = 0;
                    }
                }
            }

            //////console.log(scoreHandicap + " " + grossTotal);
            netTotal = grossTotal - scoreHandicap;

            ////console.log(netTotal);
            netUnderTotal = grossUnderTotal - scoreHandicap;

            let name: string = flightData.name['name'];
            handicap = scoreHandicap;
            let completed: boolean =
                holesPlayed > 0 &&
                holesPlayed >= 18 * flightIds.length;

            let LeaderGross: any = {
                playerId: flightData.id,
                name: name,
                picture: '',
                handicap: scoreHandicap,
                score: grossTotal,
                type: LeaderType.GROSS,
                status: status ? 1 : 0,
                extraData: '',
                under: grossUnderTotal,
                points: '',
                holes: holesPlayed,
                completed: completed,
                players: membersQLs,
                holeScores: playerHole18ScoreGross,

            };

            if (handicapAllocation == HandicapAllocation.ONE_TENTH) {
                netTotal = Math.round(netTotal);
                netUnderTotal = Math.round(netUnderTotal);
            } else if (handicapAllocation == HandicapAllocation.ONE_TENTH_DEC) {
                netTotal = netTotal.toFixed(1);
                netUnderTotal = netUnderTotal.toFixed(1);
            } else {
                netTotal = netTotal;
            }
            let LeaderNet: any = {

                playerId: flightData.id,
                name: name,
                picture: '',
                handicap: scoreHandicap,
                score: netTotal,
                type: LeaderType.NET,
                status: status ? 1 : 0,
                extraData: '',
                under: netUnderTotal,
                points: '',
                holes: holesPlayed,
                completed: completed,
                players: membersQLs,
                holeScores: playerHole18ScoreNet,

            };

            this.grossscores.push(LeaderGross);
            this.netscores.push(LeaderNet);
        }
    }
    matchPlayCalculation(tournamentQL) {

        let team1Id = tournamentQL.TeamsQL[0].id;
        let team2Id = tournamentQL.TeamsQL[1].id;
        let flights = tournamentQL.FlightsQL;
        let CourseQL = tournamentQL.CourseQL;
        let result = [];
        let checkFlight = [];
        for (let flightData of flights) {
            let membersQLs = flightData.MembersQL;
            let round = flightData.flightRound;

            for (let membersQL of membersQLs) {
                let playerId = membersQL.playerId;

                let player = membersQL.PlayerQL;
                let name = player.firstName + " " + player.lastName;
                let picture = player.picture;

                if (player == null) {
                    continue;
                }
                let holesPlayed = 0;
                let handicap = 0;
                let scores = membersQL.ScoresQL;

                let flag = this.check(playerId, checkFlight);
                if (!flag) {
                    let { oppoentId, opponentTeamId, playerTeamId } = this.findOpponent(playerId, tournamentQL);
                    checkFlight.push(playerId);
                    checkFlight.push(oppoentId);
                    //console.log('----');
                    //console.log(playerId);
                    //console.log(oppoentId);
                    //console.log('----');
                    for (let score of scores) {

                        let objScore = new Score(
                            score.playerId,
                            score.playerHandicap,
                            score.HoleIPQL.index,
                            score.HoleIPQL.par,
                            score.grossScore
                        );
                        let gross = score.grossScore;
                        let currentNet;
                        if (score.netScore == null) {
                            currentNet = objScore.getNetScore(
                                tournamentQL.handicapAllocations
                            );
                        } else {
                            currentNet = score.netScore;
                        }
                        score['netScore'] = currentNet;
                        // holesPlayed++;
                        if (gross <= 0) {
                            continue;
                        }
                        for (let newFlightData of flights) {
                            let newMembersQLs = newFlightData.MembersQL;
                            for (let newMembersQL of newMembersQLs) {
                                let newPlayerId = newMembersQL.playerId;
                                let newScores = newMembersQL.ScoresQL;
                                if (newPlayerId == oppoentId) {
                                    let newplayer = newMembersQL.PlayerQL;
                                    let newName = newplayer.firstName + " " + newplayer.lastName;
                                    for (let newScore of newScores) {
                                        let newObjScore = new Score(
                                            newScore.playerId,
                                            newScore.playerHandicap,
                                            newScore.HoleIPQL.index,
                                            newScore.HoleIPQL.par,
                                            newScore.grossScore
                                        );
                                        let newCurrentNet;
                                        if (score.netScore == null) {
                                            newCurrentNet = newObjScore.getNetScore(
                                                tournamentQL.handicapAllocations
                                            );
                                        } else {
                                            newCurrentNet = score.netScore;
                                        }
                                        newScore['netScore'] = newCurrentNet;
                                        if (newScore.holeId == score.holeId) {
                                            let newplayer = newMembersQL.PlayerQL;
                                            let newName = newplayer.firstName + " " + newplayer.lastName;
                                            let newGross = newScore.grossScore;
                                            if (newPlayerId in result) {
                                                //result[newPlayerId]["holesPlayed" + round] = newScores.length;
                                            } else {
                                                result[newPlayerId] = [];
                                                result[newPlayerId]["playerId"] = newPlayerId;
                                                result[newPlayerId]["name"] = newName;
                                                result[newPlayerId]["tied"] = false;
                                                result[newPlayerId]["teamId"] = opponentTeamId;
                                                result[newPlayerId]["picture"] = null;
                                                result[newPlayerId]["handicap"] = handicap;
                                                result[newPlayerId]["activeRound"] = tournamentQL.activeRound;
                                                result[newPlayerId]["totalRounds"] = tournamentQL.noOfRounds;
                                                result[newPlayerId]["PlayingRound"] = flightData.flightRound;
                                                result[newPlayerId]["holesPlayed" + round] = newScores.length;
                                                result[newPlayerId]["score" + round] = 0;
                                                result[newPlayerId]["score"] = newScores;
                                            }
                                            if (playerId in result) {
                                                //result[newPlayerId]["holesPlayed" + round] = scores.length;
                                            } else {
                                                result[playerId] = [];
                                                result[playerId]["playerId"] = playerId;
                                                result[playerId]["name"] = name;
                                                result[playerId]["tied"] = false;
                                                result[playerId]["picture"] = null;
                                                result[playerId]["teamId"] = playerTeamId;
                                                result[playerId]["handicap"] = handicap;
                                                result[playerId]["activeRound"] = tournamentQL.activeRound;
                                                result[playerId]["totalRounds"] = tournamentQL.noOfRounds;
                                                result[playerId]["PlayingRound"] = flightData.flightRound;
                                                result[playerId]["holesPlayed" + round] = scores.length;
                                                result[playerId]["score" + round] = 0;
                                                result[playerId]["score"] = scores;
                                            }

                                        }

                                    }
                                    let playerHole18ScoreNet: any[] = [];
                                    for (let i = 0; i < CourseQL.noOfHoles; i++) {
                                        let hole = newScores.find((a) => {
                                            return a.HoleIPQL.holeNo == i + 1;
                                        });
                                        if (hole) {
                                            playerHole18ScoreNet[i] = hole.netScore;
                                        } else {
                                            playerHole18ScoreNet[i] = 0;
                                        }
                                    }
                                    let flag = true;
                                    if (this.netscores.length > 0) {
                                        for (let item of this.netscores) {
                                            if (item.playerId === newPlayerId) {
                                                flag = false;
                                                break;
                                            }
                                        }
                                    }
                                    if (flag) {

                                        let LeaderNet: any = {
                                            courseId: flightData.courseId,
                                            holeSets: flightData.courseHoleSets,
                                            holeSetsInverted: flightData.courseHoleSetsInverted
                                                ? flightData.courseHoleSetsInverted
                                                : false,
                                            name: newName,
                                            playerId: newPlayerId,
                                            handicap: 4,
                                            playingRound: flightData.flightRound,
                                            type: LeaderType.NET,
                                            holeScores: playerHole18ScoreNet,
                                        };
                                        this.netscores.push(LeaderNet);
                                    }
                                }

                            }
                        }
                    }
                    let playerHole18ScoreNet: any[] = [];
                    for (let i = 0; i < CourseQL.noOfHoles; i++) {
                        let hole = scores.find((a) => {
                            return a.HoleIPQL.holeNo == i + 1;
                        });
                        if (hole) {
                            playerHole18ScoreNet[i] = hole.netScore;
                        } else {
                            playerHole18ScoreNet[i] = 0;
                        }
                    }
                    let flag = true;
                    if (this.netscores.length > 0) {
                        for (let item of this.netscores) {
                            if (item.playerId === playerId) {
                                flag = false;
                                break;
                            }
                        }
                    }
                    if (flag) {
                        let LeaderNet: any = {
                            courseId: flightData.courseId,
                            holeSets: flightData.courseHoleSets,
                            holeSetsInverted: flightData.courseHoleSetsInverted
                                ? flightData.courseHoleSetsInverted
                                : false,
                            name: name,
                            playerId: playerId,
                            handicap: 4,
                            playingRound: flightData.flightRound,
                            type: LeaderType.NET,
                            holeScores: playerHole18ScoreNet,
                        };
                        this.netscores.push(LeaderNet);
                    }
                }
            }
        }
        let objResult = Object.values(result);
        let team1Score = [];
        let team2Score = [];
        for (let obj of objResult) {
            if (obj.teamId == team1Id) {
                team1Score.push(obj.score);
            } else {
                team2Score.push(obj.score);
            }
        }
        let doubleArray = [];
        let doubleArray2 = [];
        let newFindArray;
        let newFindArray2;
        if (team1Score.length > 1) {
            newFindArray = team1Score.splice(1, team1Score.length);
            for (let score of team1Score) {
                score.forEach(element => {
                    let flag = true;
                    let holeId = element.holeId;
                    let objScore = new Score(
                        element.playerId,
                        element.playerHandicap,
                        element.HoleIPQL.index,
                        element.HoleIPQL.par,
                        element.grossScore
                    );
                    let currentNet = objScore.getNetScore(
                        tournamentQL.handicapAllocations
                    );
                    for (let newScore of newFindArray) {
                        newScore.forEach(newElement => {
                            let newObjScore = new Score(
                                newElement.playerId,
                                newElement.playerHandicap,
                                newElement.HoleIPQL.index,
                                newElement.HoleIPQL.par,
                                newElement.grossScore
                            );
                            let newCurrentNet = newObjScore.getNetScore(
                                tournamentQL.handicapAllocations
                            );
                            let newholeId = newElement.holeId;
                            if (newholeId == holeId && flag) {
                                if (currentNet >= newCurrentNet) {
                                    doubleArray.push(newElement);
                                    flag = false;
                                } else {
                                    doubleArray.push(element);
                                    flag = false;
                                }

                            }
                        })
                    }
                });
            }
        } else {
            doubleArray.push(team1Score[0][0]);
        }

        if (team2Score.length > 1) {
            newFindArray2 = team2Score.splice(1, team2Score.length);
            for (let score of team2Score) {
                score.forEach(element => {
                    let flag = true;
                    let holeId = element.holeId;
                    let objScore = new Score(
                        element.playerId,
                        element.playerHandicap,
                        element.HoleIPQL.index,
                        element.HoleIPQL.par,
                        element.grossScore
                    );
                    let currentNet = objScore.getNetScore(
                        tournamentQL.handicapAllocations
                    );
                    for (let newScore of newFindArray2) {
                        newScore.forEach(newElement => {
                            let newObjScore = new Score(
                                newElement.playerId,
                                newElement.playerHandicap,
                                newElement.HoleIPQL.index,
                                newElement.HoleIPQL.par,
                                newElement.grossScore
                            );
                            let newCurrentNet = newObjScore.getNetScore(
                                tournamentQL.handicapAllocations
                            );
                            let newholeId = newElement.holeId;
                            if (newholeId == holeId && flag) {
                                if (currentNet >= newCurrentNet) {
                                    doubleArray2.push(newElement);
                                    flag = false;
                                } else {
                                    doubleArray2.push(element);
                                    flag = false;
                                }

                            }
                        })
                    }
                });
            }
        } else {
            doubleArray2.push(team2Score[0][0]);
        }
        //newFindArray2 = team2Score.splice(1, team2Score.length);

        //console.log(doubleArray);
        //console.log(doubleArray2);
        this.team1Score = [];
        this.team2Score = [];

        let finalArray = [];
        let team1Points = 0;
        let team2Points = 0;

        let playerHole18ScoreNetTeam1: any[] = [];
        let playerHole18ScoreNetTeam2: any[] = [];
        for (let i = 0; i < CourseQL.noOfHoles; i++) {
            let hole1 = doubleArray.find((a) => {
                return a.HoleIPQL.holeNo == i + 1;
            });
            let hole2 = doubleArray2.find((a) => {
                return a.HoleIPQL.holeNo == i + 1;
            });
            if (hole1) {
                playerHole18ScoreNetTeam1[i] = hole1.netScore;
            } else {
                playerHole18ScoreNetTeam1[i] = 0;
            }
            if (hole2) {
                playerHole18ScoreNetTeam2[i] = hole2.netScore;
            } else {
                playerHole18ScoreNetTeam2[i] = 0;
            }
        }
        let teamId1 = objResult.find(a => { return a.playerId == doubleArray[0].playerId });
        let teamId2 = objResult.find(a => { return a.playerId == doubleArray2[0].playerId });
        let LeaderNetTeam1: any = {
            name: 'Team1',
            playerId: teamId1.teamId,
            playingRound: 0,
            type: LeaderType.NET,
            holeScores: playerHole18ScoreNetTeam1,
        };
        let LeaderNetTeam2: any = {
            name: 'Team2',
            playerId: teamId2.teamId,
            playingRound: 0,
            type: LeaderType.NET,
            holeScores: playerHole18ScoreNetTeam2,
        };
        this.team1Score.push(LeaderNetTeam1)
        this.team2Score.push(LeaderNetTeam2)


        // let doubleObj = {
        //     tournamentId: tournamentQL.id,
        //     flightId: team1Points > team2Points ? doubleArray[0].flightId : doubleArray2[0].flightId,
        //     finalResult: team1Points > team2Points ? 'A_WON' : team1Points < team2Points ? 'B_WON' : 'TIED',
        //     upScore: team1Points > team2Points ? team1Points : team2Points,
        //     remainingHoles: 18 - doubleArray.length
        // }
        // //console.log(team1Points);
        // //console.log(team2Points);
        // result['Double'] = []
        // result['Double'] = doubleObj;
        // return result;
    }
    shamblesCalculation(tournamentQL) {
        let flightsQLs = tournamentQL.FlightsQL;
        let handicapAllocation: string = this.getHandicapAllocation(
            tournamentQL.handicapAllocations
        );
        let CourseQL = tournamentQL.CourseQL;
        let PairsQLs = tournamentQL.PairsQL;
        //console.log(PairsQLs);
        let { teamMemberId, teamId, pairName } = this.findOpponentPair(this.playerId, tournamentQL);


        ////console.log(flightsQLs);
        for (let flightData of flightsQLs) {
            let pair = PairsQLs.find((a => a.flightId == flightData.id));
            console.log(pair);
            let pairsMembers = [];

            //////console.log("Flight ID: " + flightData.id);
            let membersQLs: any = flightData.MembersQL;

            for (let membersQL of membersQLs) {

                //////console.log(membersQL);
                let playerId: String = membersQL.playerId;
                if (playerId == pair.member1Id || playerId == pair.member2Id) {
                    pairsMembers.push(membersQL)
                }
                //let playerQL:Player = membersQL.PlayerQL;
                if (playerId != this.playerId && playerId != teamMemberId) {
                    continue;
                }
                //this.players.push(playerQL);

                let player: Player = membersQL.PlayerQL;
                //////console.log(player);
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
                    handicap +=
                        objScore.getPlayerHandicap(handicapAllocation);
                    scoreHandicap =
                        objScore.getPlayerHandicap(handicapAllocation);
                    holesPlayed++;

                    if (!flightIds.includes(score.flightId)) {
                        flightIds.push(score.flightId);
                    }
                    cntr++;

                    //if(player.id == "-L6192uVBlBFw3grUy9_")
                    //////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.hole.holeNo);
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

                //////console.log(scoreHandicap + " " + player.handicap);
                netTotal = grossTotal - scoreHandicap;
                // ////console.log(netTotal);
                netUnderTotal = grossUnderTotal - scoreHandicap;

                let name: string = player.firstName + ' ' + player.lastName;
                if (
                    tournamentQL.matchFormat ==
                    matchFormat.TEXAS_SCRAMBLE ||
                    tournamentQL.matchFormat ==
                    matchFormat.THREE_BALL_SCRAMBLE ||
                    tournamentQL.matchFormat ==
                    matchFormat.THREE_BALL_SCRAMBLE
                ) {
                    name = flightData.name['name'];
                }

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
                    holesPlayed > 0 && holesPlayed >= 18 * flightIds.length;

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
                    players: pairsMembers,
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
                    playerId: playerId,
                    players: pairsMembers,
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

    findOpponent(playerId, TournamentQL) {
        if (TournamentQL.OpponentsQL.length > 0) {
            let oppoentId;
            let opponentTeamId;
            let playerTeamId;
            for (let data of TournamentQL.OpponentsQL) {
                if (data.team1MemberId == playerId) {
                    oppoentId = data.team2MemberId;
                    opponentTeamId = data.team2Id;
                    playerTeamId = data.team1Id;
                } else if (data.team2MemberId == playerId) {
                    oppoentId = data.team1MemberId;
                    opponentTeamId = data.team1Id;
                    playerTeamId = data.team2Id;
                }
            }
            return { oppoentId, opponentTeamId, playerTeamId };
        }
    }

    findOpponentPair(playerId, TournamentQL) {
        if (TournamentQL.PairsQL.length > 0) {
            let teamMemberId;
            let teamId;
            let pairName;
            for (let data of TournamentQL.PairsQL) {
                if (data.member1Id == playerId) {
                    teamMemberId = data.member2Id;
                    teamId = data.id;
                    pairName = data.pairName;

                } else if (data.member2Id == playerId) {
                    teamMemberId = data.member1Id;
                    teamId = data.id;
                    pairName = data.pairName;
                }
            }
            return { teamMemberId, teamId, pairName };
        }
    }
    check(playerId, flights) {
        if (flights.length > 0) {
            for (let data of flights) {
                if (data == playerId) {
                    return true;
                }
            }
        }
        return false;
    }
}
