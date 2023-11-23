// Import necessary modules and components
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPlayerScoreComponent } from '../../dialogs/dialog-player-score/dialog-player-score.component';
import { handicapAllocation } from 'app/shared/classes/general';
import { Player } from 'app/shared/models/player.model';
import { Score } from 'app/shared/classes/score';
import { LeaderTypeValue } from 'app/shared/classes/leader';
import { PlayersScoreLoader } from 'app/shared/helper/PlayersViewScore';
import { FacadeService } from 'app/shared/services/facade.service';
@Component({
    selector: 'app-match-play', // This is the selector for the component
    templateUrl: './matchPlay.component.html', // HTML template file path
    styleUrls: ['./matchPlay.component.scss'] // CSS/SCSS styles file(s) path
})
export class MatchPlayComponent implements OnInit, OnChanges {
    @Input() data: any;
    Leaderboard: any;
    LeaderboardScore: any;
    LeaderboardAllPlayers: any[] = [];
    LeaderboardPlayers: any[] = [];
    allLeadersCutOffGross: any[] = [];
    allLeadersCutOffNet: any[] = [];
    Team1: any[] = [];
    Team2: any[] = [];
    selectedCategory: any;
    signleWinColour: any = '21ACB5';
    doubleWinColour: any = '21ACB5';
    team1PointS: any = 0;
    team2PointS: any = 0;
    team1PointD: any = 0;
    team2PointD: any = 0;
    selectedIndex: any = 0;
    flightRound: any = 0;
    activeRound: any = 1;
    totalRounds: any = 1;
    lastActiveTab: any = 1;
    cuttOffScore: number = 0;
    doubleHoles: number = 0;

    showBestBall: boolean = false;
    doubleScoreEnd: boolean = false;
    isCuttOffRequired: boolean = false;
    allRoundGrossScore: boolean = false;
    allRoundNetScore: boolean;
    allRoundCutOff: boolean = false;
    searchName: boolean = false;
    allRoundCutOffNet: boolean = false;

    isGross: boolean = false;
    isNet: boolean = true;
    isDoubles: boolean = true;
    isSingles: boolean = false;
    isDoubleWonA: boolean = false;
    isDoubleWonB: boolean = false;
    doubleScore = 0;

    selectedCategoryValue: string = '';
    eventCategories: string[] = [];
    tRounds: any[] = [];
    categoryLimit: number;
    constructor(
        public dialog: MatDialog, private facadeService: FacadeService
    ) { }

    ngOnInit(): void {
        console.log(this.data);
        this.Leaderboard = this.data.TournamentQL[0];
        this.LeaderboardScore = this.data.LeaderBoardQL;
        this.activeRound = this.Leaderboard.activeRound;
        this.totalRounds = this.Leaderboard.noOfRounds;
        this.Team1 = [];
        this.Team2 = [];
        let count = 1;
        this.Leaderboard.TeamQL.forEach(element => {
            let obj = {
                id: element.id,
                name: element.name,
                color: element.color,
                members: this.getMembers(element.tournamentId, element.id, this.Leaderboard.TeamQL[0], count),
            }
            count++;
            if (count == 2) {
                this.Team1.push(obj);
            } else {
                this.Team2.push(obj);

            }
        });

        this.team1PointD = 0;
        this.team2PointD = 0;
        if (this.Leaderboard.TeamResultDoublesQL.length > 0) {
            for (let obj of this.Leaderboard.TeamResultDoublesQL) {
                let score = obj.upScore;
                let finalResult = obj.finalResult;
                let remainingHoles = obj.remainingHoles;
                let round = obj.round;
                if (score > 0) {
                    if (finalResult == 'A_WON') {
                        this.isDoubleWonA = true;
                        this.doubleWinColour = this.Team1[0]['color'];
                        this.team1PointD++;
                        // this.team2PointD = 0;
                        this.Team2[0]['scoreR' + round] = 0;
                        this.Team2[0]['tiedR' + round] = false;
                        this.Team1[0]['scoreR' + round] = score;
                        this.Team1[0]['tiedR' + round] = false;
                        this.Team1[0]['holesR' + round] = score > remainingHoles ? remainingHoles : 1000;
                        this.Team2[0]['holesR' + round] = score > remainingHoles ? remainingHoles : 1000;

                    } else if (finalResult == 'B_WON') {
                        this.isDoubleWonB = true;
                        this.doubleWinColour = this.Team2[0]['color'];
                        // this.team1PointD = 0;
                        this.team2PointD++;
                        this.Team1[0]['scoreR' + round] = 0;
                        this.Team2[0]['scoreR' + round] = score;
                        this.Team2[0]['tiedR' + round] = false;
                        this.Team1[0]['tiedR' + round] = false;
                        this.Team2[0]['holesR' + round] = score > remainingHoles ? remainingHoles : 1000;
                        this.Team1[0]['holesR' + round] = score > remainingHoles ? remainingHoles : 1000;

                    }
                    // if (score > remainingHoles) {
                    //     if (finalResult == 'A_WON') {

                    //     }
                    // }
                    // this.doubleScore = score;

                } else {

                    this.Team1[0]['tiedR' + round] = true;
                    this.Team2[0]['tiedR' + round] = true;
                }
            }
        }
        console.log(this.Team1);
        console.log(this.Team2);
        // console.log('a');
        this.LeaderboardAllPlayers = [];
        this.team1PointS = 0;
        this.team2PointS = 0;
        let matchResult = [];
        if (this.Leaderboard.TeamQL[0].OpponentsQL.length > 0) {
            let members = this.Leaderboard.TeamQL[0].OpponentsQL;
            let upScore = 0;
            let color = '';
            let end: boolean = false;
            let id = '';
            for (let mem of members) {
                end = false;
                let team1MemberId = mem.team1MemberId;
                let team2MemberId = mem.team2MemberId;
                let Score1 = this.LeaderboardScore.filter(a => { return a.playerId == team1MemberId });
                let Score2 = this.LeaderboardScore.filter(a => { return a.playerId == team2MemberId });
                if (Score1.length > 0 && Score2.length > 0) {
                    for (let i = 1; i <= this.totalRounds; i++) {
                        let score1 = Score1[0][`scoreR` + i];
                        let score2 = Score2[0][`scoreR` + i];
                        let hole1 = Score1[0][`holesPlayedR` + i];
                        let hole2 = Score2[0][`holesPlayedR` + i];
                        let holes = 18 - Score1[0][`holesPlayedR` + i];
                        if (score1 > score2) {
                            color = this.getcolor(this.Team1[0], Score1[0].playerId);
                            upScore = score1;
                            this.team1PointS += 1;
                            id = Score1[0].playerId;
                        } else if ((score1 < score2)) {
                            color = this.getcolor(this.Team2[0], Score2[0].playerId);
                            upScore = score2;
                            this.team2PointS += 1;
                            id = Score2[0].playerId;
                        } else if (hole1 !== 0 || hole2 !== 0) {
                            id = Score2[0].playerId;
                            upScore = 0;
                            color = '#818181';

                            if (id in matchResult) {
                                matchResult[id]['upScore' + i] = upScore;
                                matchResult[id]['holes' + i] = holes;
                                matchResult[id]['end' + i] = end;
                            } else {
                                matchResult[id] = [];
                                matchResult[id]['upScore' + i] = upScore;
                                matchResult[id]['holes' + i] = holes;
                                matchResult[id]['color'] = color;
                                matchResult[id]['id'] = id;
                                matchResult[id]['end' + i] = end;
                            }
                            id = Score1[0].playerId;
                        } else {
                            id = Score2[0].playerId;
                            upScore = 0;
                            color = this.getcolor(this.Team2[0], Score2[0].playerId);
                            if (id in matchResult) {
                                matchResult[id]['upScore' + i] = upScore;
                                matchResult[id]['holes' + i] = holes;
                                matchResult[id]['end' + i] = end;
                            } else {
                                matchResult[id] = [];
                                matchResult[id]['upScore' + i] = upScore;
                                matchResult[id]['holes' + i] = holes;
                                matchResult[id]['color'] = color;
                                matchResult[id]['id'] = id;
                                matchResult[id]['end' + i] = end;
                            }
                            id = Score1[0].playerId;
                        }
                        if (upScore > holes) {
                            end = true;
                        }
                        if (id in matchResult) {
                            matchResult[id]['upScore' + i] = upScore;
                            matchResult[id]['holes' + i] = holes;
                            matchResult[id]['end' + i] = end;
                        } else {
                            matchResult[id] = [];
                            matchResult[id]['upScore' + i] = upScore;
                            matchResult[id]['holes' + i] = holes;
                            matchResult[id]['color'] = color;
                            matchResult[id]['id'] = id;
                            matchResult[id]['end' + i] = end;
                        }
                        upScore = 0;
                        holes = 0;
                        end = false;

                        //this.LeaderboardAllPlayers.push(obj)
                    }

                } else {
                    let obj = {
                        holes: 0,
                        id: id,
                        color: '#818181',
                        end: false,
                    }
                    obj[`upScoreR1`] = 0;
                    this.LeaderboardAllPlayers.push(obj);
                }

            }
            console.log(matchResult);
            this.LeaderboardAllPlayers = Object.values(matchResult);
            // console.log(this.LeaderboardAllPlayers);

        }

        /// console.log(this.allTeams);

        // this.LeaderboardAllPlayers = this.data.LeaderBoardQL;
        this.tRounds = [];
        if (this.tRounds.length >= 0) {
            for (
                let round = 1;
                round <= this.Leaderboard.noOfRounds;
                round++
            ) {
                let r: any = {
                    Text: 'Round ' + round,
                    Value: round,
                };
                this.tRounds.push(r);
            }
        }
        // this.getPlayers(this.LeaderboardAllPlayers, 0, 1)

    }

    getMembers(tournamentId, teamId, element, count) {
        let players = [];
        element.OpponentsQL.forEach(obj => {
            if (obj.tournamentId == tournamentId) {
                if (count == 1) {
                    let play = {
                        name: obj.playerTeam1.firstName + " " + obj.playerTeam1.lastName,
                        handicap: obj.playerTeam1.handicap,
                        id: obj.team1MemberId,
                        teamId: teamId,
                    }
                    players.push(play)
                } else {
                    let play = {
                        name: obj.playerTeam2.firstName + " " + obj.playerTeam2.lastName,
                        handicap: obj.playerTeam2.handicap,
                        id: obj.team2MemberId,
                        teamId: teamId,
                    }
                    players.push(play)
                }
            }
        });
        return players;

    }

    getSinglesBG(item: any): { [key: string]: string } {
        //console.log(item);
        const underValue = this.LeaderboardAllPlayers.filter((a) => { return a.id == item.id })
        // console.log(underValue);
        const style = {};
        if (underValue.length > 0) {
            style['background-color'] = underValue[0]['color']; // Set the 'color' property to 'red'
        }
        return style;
    }
    getSinglePlayerScore(item: any, round: any): string {
        //console.log(item);
        const underValue = this.LeaderboardAllPlayers.filter((a) => { return a.id == item.id })
        if (underValue.length > 0) {
            if (underValue[0]['upScore' + round] != undefined && underValue[0]['upScore' + round] > 0) {
                if (underValue[0]['upScore' + round] > underValue[0]['holes' + round]) {
                    return `WINS ${underValue[0]['upScore' + round]} UP & ${underValue[0]['holes' + round]}`;
                } else {
                    return `WINS ${underValue[0]['upScore' + round]} UP `;
                }
            } else if (underValue[0]['upScore' + round] != undefined && underValue[0]['upScore' + round] == 0) {
                return 'TIED';
            } else {
                return '';
            }
        }
        return '';
    }
    getcolor(team, id) {

        let find = team.members.filter(a => { return a.id == id });
        if (find) {
            return team.color;
        }

    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        //this.data = changes.data.currentValue;
        this.ngOnInit();
    }
    getPlayers(leaders: any[], round: any, lastTab: any) {
        this.LeaderboardPlayers = [];
        this.allLeadersCutOffGross = [];
        this.allLeadersCutOffNet = [];
        if (round == 0) {
            if (leaders.length > 0) {
                this.LeaderboardPlayers = leaders;
                console.log(this.LeaderboardPlayers);
                if (this.Leaderboard.cutOffCriteria !== null) {
                    this.cutLeaders(this.Leaderboard.cutOffCriteria, this.LeaderboardPlayers)
                }
                if (this.allLeadersCutOffNet.length > 0) {
                    this.isCuttOffRequired = true;
                    this.allRoundCutOffNet = true;
                    this.sortAllNetLeadersTie(this.allLeadersCutOffNet)
                }
                this.LeaderboardPlayers.sort(this.ComparatorAllNet);
                this.sortAllNetLeadersTie(this.LeaderboardPlayers);
            }
        } else {
            this.getPlayersByRound(leaders, round, lastTab);
        }
    }
    cutLeaders(cutOff, leaders) {
        let cutObj = this.Leaderboard.cutOffCriteria["cutOff"].filter(
            (obj) => obj.name === this.selectedCategoryValue
        );
        if (cutObj) {
            this.cuttOffScore = cutObj[0].score;
            for (let i = leaders.length - 1; i >= 0; i--) {
                const item = leaders[i];
                if (
                    cutObj[0].type == 'GROSS' && item.underGross > cutObj[0].score &&
                    cutObj[0].score > 0 &&
                    item.PlayingRound != this.activeRound
                ) {
                    leaders.splice(i, 1);
                    this.allLeadersCutOffGross.push(item);
                } else if (cutObj[0].type == 'NET' && item.underNet > cutObj[0].score &&
                    cutObj[0].score > 0 &&
                    item.PlayingRound != this.activeRound) {
                    leaders.splice(i, 1);
                    this.allLeadersCutOffNet.push(item);
                }
            }
        }
    }
    getPlayersByRound(leaders: any[], round: number, lastTab: any) {
        this.LeaderboardPlayers = [];
        if (leaders.length > 0) {
            this.LeaderboardPlayers = leaders.filter(obj => {
                const propertyName = `holesPlayedR${round}`; // Dynamically construct the property name
                return obj.category === this.selectedCategoryValue && obj[propertyName] > 0;
            });
        }

        this.LeaderboardPlayers.sort((a, b) => {
            return this.ComparatorScoreN(a, b, this.flightRound);
        });
        this.sortLeadersNet(this.LeaderboardPlayers, round);

    }

    changeRound(item) {
        this.flightRound = item.value;
        if (item.value == '0') {
            if (this.lastActiveTab == 1) {
                this.isGross = false;
                this.isNet = false;
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)
            } else if (this.lastActiveTab == 2) {
                this.isNet = false;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = true;
                this.allRoundCutOffNet = true;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)
            } else {
                this.isGross = false;
                this.isNet = false;
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)
            }
        } else {
            if (this.lastActiveTab == 1) {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)
            } else if (this.lastActiveTab == 2) {
                this.isNet = true;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)
            } else {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)
            }
        }
    }
    selectionChanged(item) {
        // this.activeRound = this.Leaderboard.activeRound;
        // if (this.flightRound == 0) {
        //     if (item.value == LeaderTypeValue.GROSS) {
        //         ////console.log("Selected value: " + item.value);
        //         this.allRoundGrossScore = true;
        //         this.allRoundCutOff = true;

        //         this.allRoundNetScore = false;
        //         this.allRoundCutOffNet = false;

        //         this.isGross = false;
        //         this.isNet = false;
        //         this.lastActiveTab = 1;
        //         this.getPlayers(this.LeaderboardAllPlayers, 0, 1)

        //     } else if (item.value == LeaderTypeValue.NET) {
        //         ////console.log("Selected value: " + item.value);
        //         this.allRoundGrossScore = false;
        //         this.allRoundCutOff = false;

        //         this.allRoundNetScore = true;
        //         this.allRoundCutOffNet = true;
        //         this.isNet = false;
        //         this.isGross = false;
        //         this.lastActiveTab = 2;
        //         this.getPlayers(this.LeaderboardAllPlayers, 0, 2)

        //     }

        // } else {
        //     if (item.value == LeaderTypeValue.GROSS) {
        //         ////console.log("Selected value: " + item.value);
        //         this.isGross = true;
        //         this.isNet = false;
        //         this.allRoundGrossScore = false;
        //         this.allRoundCutOff = false;

        //         this.allRoundNetScore = false;
        //         this.allRoundCutOffNet = false;
        //         this.lastActiveTab = 1;
        //         this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)

        //     } else if (item.value == LeaderTypeValue.NET) {
        //         ////console.log("Selected value: " + item.value);
        //         this.isNet = true;
        //         this.isGross = false;
        //         this.allRoundGrossScore = false;
        //         this.allRoundCutOff = false;

        //         this.allRoundNetScore = false;
        //         this.allRoundCutOffNet = false;
        //         this.lastActiveTab = 2;
        //         this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 2)

        //     }
        // }
        if (item.value == '1') {
            this.isDoubles = true;
            this.isSingles = false;
        } else {
            this.isDoubles = false;
            this.isSingles = true;
        }

    }
    filterByQuery(query) {
        // if (query.length > 3) {
        //     this.searchName = true;
        //     console.log(this.allMatchResults);
        //     if (this.allLeadersGross.length > 0) {
        //         this.allMatchSearchResults = this.allLeadersGross.filter(
        //             (obj) => {
        //                 return obj.name
        //                     .toString()
        //                     .toLowerCase()
        //                     .includes(query.toString().toLowerCase());
        //             }
        //         );
        //     } else {
        //         this.allMatchSearchResults = this.grossLeaders.filter((obj) => {
        //             return obj.name
        //                 .toString()
        //                 .toLowerCase()
        //                 .includes(query.toString().toLowerCase());
        //         });
        //     }
        // } else {
        //     this.allMatchSearchResults = [];
        //     this.searchName = false;
        // }
    }
    getHandicapAllocation(): string {
        let hcAllocation: string;

        if (this.Leaderboard.handicapAllocations)
            hcAllocation =
                this.Leaderboard.handicapAllocations['handicapAllocation'];
        else hcAllocation = handicapAllocation.AS_IS;

        return hcAllocation;
    }
    async viewPlayerScore(
        name: string,
        courseId: string,
        courseHoleSets: string,
        playerId: string,
        holeSetsInverted: string,
        scoreType: string
    ) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];
        let playerPerTeam: any[];
        let team: boolean = false;
        let removed: string[] = [];
        let scores: any[];
        let scoresArray: any[] = [];
        let ScoreLoader = new PlayersScoreLoader(this.facadeService, this.Leaderboard.id, playerId);
        await ScoreLoader.fetchTournamentScores();
        let scoreResult = ScoreLoader.getMatchPlayScore(playerId);
        console.log(scoreResult);

        const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
            data: {
                name: name,
                tee_id:
                    this.Leaderboard.tee_id != null
                        ? this.Leaderboard.tee_id
                        : 1,
                course: this.Leaderboard.courseId,
                players: [],
                holeSets: this.Leaderboard.courseHoleSets ? this.Leaderboard.courseHoleSets : 3,
                allGross: scoreResult.grossScore,
                courseHoleSetsInverted: this.Leaderboard.courseHoleSetsInverted,
                allNet: scoreResult.netScore,
                round: this.flightRound,
                type: 'Net',
                team: team,
                removed: removed,
            },
        });
    }
    async viewTeamScore(
        name: string,
        courseId: string,
        courseHoleSets: string,
        playerId: string,
        holeSetsInverted: string,
        scoreType: string
    ) {
        let playerGrossScore: any[] = [];
        let playerNetScore: any[] = [];
        let playerPerTeam: any[];
        let team: boolean = false;
        let removed: string[] = [];
        let scores: any[];
        let scoresArray: any[] = [];
        let ScoreLoader = new PlayersScoreLoader(this.facadeService, this.Leaderboard.id, playerId);
        await ScoreLoader.fetchTournamentScores();
        let scoreResult = ScoreLoader.getMatchPlayTeamScore(playerId);
        console.log(scoreResult);

        const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
            data: {
                name: name,
                tee_id:
                    this.Leaderboard.tee_id != null
                        ? this.Leaderboard.tee_id
                        : 1,
                course: this.Leaderboard.courseId,
                players: [],
                holeSets: this.Leaderboard.courseHoleSets ? this.Leaderboard.courseHoleSets : 3,
                allGross: scoreResult.grossScore,
                courseHoleSetsInverted: this.Leaderboard.courseHoleSetsInverted,
                allNet: scoreResult.netScore,
                round: this.flightRound,
                type: 'Net',
                team: team,
                removed: removed,
            },
        });
    }
    ComparatorAllNet(a, b) {
        if (a['scoreR1'] < b['scoreR1']) return -1;
        if (a['scoreR1'] > b['scoreR1']) return 1;
        return 0;
    }
    ComparatorScoreN(a, b, flightRound) {

        if (a[`underNet${flightRound}`] < b[`underNet${flightRound}`]) return -1;
        if (a[`underNet${flightRound}`] > b[`underNet${flightRound}`]) return 1;
        return 0;
    }
    public getLastHolesTotal(noOfHoles: number, holeScores: any[]): number {
        let total: number = 0;

        for (let i = holeScores.length - 1; i >= 0 && noOfHoles > 0; i--) {
            total += holeScores[i];
            noOfHoles--;
        }

        return total;
    }

    private sortLeadersNet(leaderList: any[], round) {
        //Collections.sort(grossLeaders);
        console.log(leaderList);

        //leaderList = leaderList.sort(this.ComparatorPosition);
        ////console.log(leaderList);
        //return false;

        let pos: number = 1;
        let tied: boolean;

        if (leaderList.length > 0) leaderList[0]['position'] = pos;
        ////console.log(leaderList);
        for (let i = 1; i < leaderList.length; i++) {
            let leaderCurrent = leaderList[i];
            let leaderPrevious = leaderList[i - 1];

            let currentHoleScore: number = 0;
            let previousHoleScore: number = 0;

            tied = leaderCurrent[`underNet${round}`] == leaderPrevious[`underNet${round}`];
            ////console.log(tied);
            if (tied && leaderCurrent.completed && leaderPrevious.completed) {
                let noOfHoles = 9;
                while (tied && noOfHoles > 0) {
                    //tied = this.getLastHolesTotal(noOfHoles, leaderCurrent.holeScores) == this.getLastHolesTotal(noOfHoles, leaderPrevious.holeScores);
                    currentHoleScore = this.getLastHolesTotal(
                        noOfHoles,
                        leaderCurrent.holeScores
                    );
                    previousHoleScore = this.getLastHolesTotal(
                        noOfHoles,
                        leaderPrevious.holeScores
                    );

                    tied = currentHoleScore == previousHoleScore;

                    if (noOfHoles > 3) {
                        noOfHoles -= 3;
                    } else {
                        noOfHoles -= 2;
                    }
                }
            }

            if (tied) {
                //leaderCurrent["tied"]= true;
                //leaderPrevious["tied"]= true;
                leaderList[i]['tied'] = true;
                leaderList[i - 1]['tied'] = true;
                leaderList[i]['position'] = 'T' + pos;
                leaderList[i - 1]['position'] = 'T' + pos;
            } else {
                pos = i + 1;
                leaderList[i]['position'] = pos;
            }

            ////console.log("position-> " + pos + " -->" + leaderCurrent.name);
        }
        //leaderList = leaderList.sort(this.ComparatorPosition);
    }
    ComparatorPosition(a, b) {
        let compare: number;

        compare = Number(a.status) - Number(b.status);
        if (compare != 0) {
            return compare;
        }

        let selfHoles: number = a.holes;
        let leaderHoles: number = b.holes;

        if (selfHoles != 0 && leaderHoles != 0) {
            compare = a.under - b.under;

            if (compare != 0) {
                return compare;
            }
            if (a.completed && b.completed) {
                let noOfHoles: number = 9;
                while (noOfHoles > 0) {
                    if (noOfHoles == 9)
                        compare = a.holeScoreLast9 - b.holeScoreLast9;
                    else if (noOfHoles == 6)
                        compare = a.holeScoreLast6 - b.holeScoreLast6;
                    else if (noOfHoles == 3)
                        compare = a.holeScoreLast3 - b.holeScoreLast3;
                    else if (noOfHoles < 3)
                        compare = a.holeScoreLast1 - b.holeScoreLast1;

                    if (compare != 0) {
                        return compare;
                    }
                    if (noOfHoles > 3) {
                        noOfHoles -= 3;
                    } else {
                        noOfHoles -= 2;
                    }
                }
            }
        }
        compare = leaderHoles - selfHoles;
        if (compare != 0) {
            return compare;
        }

        //if (a["position"] < b["position"]) return -1;
        //if (a["position"] > b["position"]) return 1;

        return 0;
    }
    private sortAllNetLeadersTie(leaderList: any[]) {
        //Collections.sort(grossLeaders);

        leaderList = leaderList.sort(this.ComparatorAllNetPosition);
        ////console.log(leaderList);
        //return false;

        let pos: number = 1;
        let tied: boolean;

        if (leaderList.length > 0) leaderList[0]['position'] = pos;
        ////console.log(leaderList);
        for (let i = 1; i < leaderList.length; i++) {
            let leaderCurrent = leaderList[i];
            let leaderPrevious = leaderList[i - 1];
            let firstCompleted = false;
            let secondCompleted = false;

            let checkRoundPlayed =
                leaderCurrent.activeRound > leaderCurrent.totalRounds
                    ? leaderCurrent.totalRounds
                    : leaderCurrent.activeRound;

            if (checkRoundPlayed == 1) {
                firstCompleted = leaderCurrent.completed1;
                secondCompleted = leaderPrevious.completed1;
            } else if (checkRoundPlayed == 2) {
                firstCompleted = leaderCurrent.completed2;
                secondCompleted = leaderPrevious.completed2;
            } else if (checkRoundPlayed == 3) {
                firstCompleted = leaderCurrent.completed3;
                secondCompleted = leaderPrevious.completed3;
            } else if (checkRoundPlayed == 4) {
                firstCompleted = leaderCurrent.completed4;
                secondCompleted = leaderPrevious.completed4;
            }
            tied = leaderCurrent.scoreR1 == leaderPrevious.scoreR1;

            if (tied) {
                //leaderCurrent["tied"]= true;
                //leaderPrevious["tied"]= true;
                leaderList[i]['tied'] = true;
                leaderList[i - 1]['tied'] = true;
                leaderList[i]['position'] = 'T' + pos;
                leaderList[i - 1]['position'] = 'T' + pos;
            } else {
                pos = i + 1;
                leaderList[i]['position'] = pos;
            }
            ////console.log(pos);

            ////console.log("position-> " + pos + " -->" + leaderCurrent.name);
        }
        //leaderList = leaderList.sort(this.ComparatorAllGrossPosition);
        ////console.log("return");
        console.log(leaderList);
        return leaderList;
    }

    ComparatorAllNetPosition(a, b) {
        let compare: number;

        compare = Number(a.status) - Number(b.status);
        if (compare != 0) {
            return compare;
        }
        if (a.playerStatus < b.playerStatus) {
            return -1;
        }
        if (a.playerStatus > b.playerStatus) {
            return 1;
        }

        let selfHoles: number = 0;
        let leaderHoles: number = 0;
        let completed: boolean = false;
        let checkRoundPlayed =
            a.activeRound > a.totalRounds ? a.totalRounds : a.activeRound;

        if (checkRoundPlayed == 1) {
            selfHoles = a.holes1;
            leaderHoles = b.holes1;
            completed = a.completed1 && b.completed1;
        } else if (checkRoundPlayed == 2) {
            selfHoles = a.holes2;
            leaderHoles = b.holes2;
            completed = a.completed2 && b.completed2;
        } else if (checkRoundPlayed == 3) {
            selfHoles = a.holes3;
            leaderHoles = b.holes3;
            completed = a.completed3 && b.completed3;
        } else if (checkRoundPlayed == 4) {
            selfHoles = a.holes4;
            leaderHoles = b.holes4;
            completed = a.completed4 && b.completed4;
        }

        if (selfHoles != 0 && leaderHoles != 0) {
            compare = a.scoreR1 - b.scoreR1;

            if (compare != 0) {
                return compare;
            }
            if (completed) {
                let noOfHoles: number = 9;
                while (noOfHoles > 0) {
                    if (noOfHoles == 9)
                        compare = a.holeScoreLast9 - b.holeScoreLast9;
                    else if (noOfHoles == 6)
                        compare = a.holeScoreLast6 - b.holeScoreLast6;
                    else if (noOfHoles == 3)
                        compare = a.holeScoreLast3 - b.holeScoreLast3;
                    else if (noOfHoles < 3)
                        compare = a.holeScoreLast1 - b.holeScoreLast1;

                    if (compare != 0) {
                        return compare;
                    }
                    if (noOfHoles > 3) {
                        noOfHoles -= 3;
                    } else {
                        noOfHoles -= 2;
                    }
                }
                compare = leaderHoles - selfHoles;
                if (compare != 0) {
                    return compare;
                }
            }
        }

        //if (a["position"] < b["position"]) return -1;
        //if (a["position"] > b["position"]) return 1;

        return 0;
    }
}
