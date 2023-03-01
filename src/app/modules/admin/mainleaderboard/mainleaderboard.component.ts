import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
    Player,
    TournamentMemberStatus,
    enumPlayerCategory,
} from 'app/shared/models/player.model';
import {
    TournamentCategory,
    TournamentRounds,
    LeaderboardAd,
    matchFormat,
    HandicapAllocation,
} from 'app/shared/models/tournament.model';
import { FacadeService } from 'app/shared/services/facade.service';
import { of, interval, Subscription } from 'rxjs';
import { Score } from 'app/shared/classes/score';
import { handicapAllocation, Constants } from 'app/shared/classes/general';
import { LeaderType, LeaderTypeValue } from 'app/shared/classes/leader';
//import { TournamentHandicapCategory } from 'src/app/shared/classes/TournamentHandicapCategory';

import { Apollo } from 'apollo-angular';
import { async } from '@angular/core/testing';
import { DialogPlayerScoreComponent } from '../dialogs/dialog-player-score/dialog-player-score.component';
import { LeaderboardSubscription } from 'app/shared/GraphQL/tournament.gql';

@Component({
    selector: 'app-mainleaderboard',
    templateUrl: './mainleaderboard.component.html',
    styleUrls: ['./mainleaderboard.component.scss'],
})
export class MainLeaderboardComponent implements OnInit {
    private tournamentID: string;
    Leaderboard: any;
    private noOfHolesInCourse: number = 18;
    activeRound: number;
    totalRounds: number;
    flightRound: number;
    isLoading: boolean = true;
    tRounds: TournamentRounds[] = [];
    roundFlights: any[] = [];
    matchFormat: string;
    teamMatch: boolean;
    selectedSubTournament: string;
    subTournamentDetail: any[] = [];
    net: any[] = [];
    loggedInUser: Player;
    showdata: Promise<boolean>;
    players: Player;
    activePlayers: Player[] = [];
    playerScores: Score[];
    memberStatusesQLs: TournamentMemberStatus[] = [];
    categories: any[] = [];
    leaderboardAd: LeaderboardAd[];
    allllll: any[] = [];
    showTaxes: boolean = false;

    allMatchResults: any[] = [];
    allLeadersGross: any[] = [];
    allLeadersCutOffGross: any[] = [];
    allLeadersCutOffNet: any[] = [];
    allLeadersNet: any[] = [];

    grossLeaders: any[] = [];
    netLeaders: any[] = [];
    grossAllLeaders: any[] = [];
    netAllLeaders: any[] = [];

    selectedCategory: any;
    selectedCategoryValue: string = '';
    eventCategories: string[] = [];
    categoryLimit: number;

    upperCategoryLimit: boolean = false;
    showPairs: boolean;
    allRoundGrossScore: boolean = true;
    allRoundNetScore: boolean;
    allRoundCutOff: boolean = false;
    allRoundCutOffNet: boolean = false;
    cuttOffScore: number = 0;
    isCuttOffRequired: boolean = false;
    cutOffLine: any;
    leaderGrossQL: any;
    leaderNetQL: any;
    clubLogo: any;
    leaderLogo: any;
    selectedMembers: Player[][] = [];
    runningFlights: number = 0;
    isClubAdmin: boolean = false;
    isGross: boolean;
    isNet: boolean;
    lastActiveTab = 1;
    cutOffList: any;
    subscription: Subscription;
    webLogoUrl: string =
        'http://gemgolfers.com/wp-content/uploads/2019/01/gem-logo.png';
    dataLeaderboards: any;

    constructor(
        private apollo: Apollo,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public facadeService: FacadeService
    ) {}

    async ngOnInit() {
        this.getOnLoadData();

        const source = interval(60000 * 30);
        this.subscription = source.subscribe((val) => window.location.reload());
    }

    async getOnLoadData() {
        this.route.paramMap.subscribe((params) => {
            //console.log(params.get("id"));
            this.tournamentID = params.get('id');
        });

        let clubInfo: any;
        this.loggedInUser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        if (this.loggedInUser) {
            clubInfo =
                this.loggedInUser.membership.length > 0
                    ? this.loggedInUser.membership[0].club
                    : null;
        }

        if (this.tournamentID == 'jazamanogc') {
            this.clubLogo = 'J-Zaman.png';
        } else if (this.tournamentID == '1stumanza-1') {
            this.clubLogo = 'rumanza.png';
        } else {
            this.clubLogo =
                clubInfo && clubInfo.logo ? clubInfo.logo : 'e2esp.png';
        }
        of(this.Leaderboard)
            .pipe()
            .subscribe(async (data) => {
                this.apollo
                    .subscribe({
                        query: LeaderboardSubscription,
                        variables: {
                            tournamentPrefix: this.tournamentID,
                        },
                    })
                    .subscribe(({ data }) => {
                        if (!data) {
                            //console.log(data);
                        } else {
                            let dataLeaderboard: any = data;
                            //console.log(data);
                            //console.log(dataLeaderboard);

                            this.allMatchResults = [];
                            this.allLeadersGross = [];
                            this.allLeadersCutOffGross = [];
                            this.allLeadersNet = [];
                            this.grossLeaders = [];
                            this.netLeaders = [];
                            this.grossAllLeaders = [];
                            this.netAllLeaders = [];

                            this.tRounds = [];
                            this.teamMatch = false;

                            this.Leaderboard = dataLeaderboard.TournamentQL[0];
                            ////console.log(this.Leaderboard);
                            if (this.Leaderboard.cutOffCriteria != null) {
                                if (
                                    'cutOff' in this.Leaderboard.cutOffCriteria
                                ) {
                                    if (this.Leaderboard.cutOffCriteria) {
                                        if (
                                            Object.keys(
                                                this.Leaderboard.cutOffCriteria
                                            ).length
                                        )
                                            this.cutOffList =
                                                this.Leaderboard.cutOffCriteria;
                                        // //console.log(this.cutOffList);
                                        // //console.log(this.cutOffList.cutOff);

                                        //console.log(this.cutOffList["cutOff"]);
                                    }
                                }
                            }

                           
                            this.activeRound = this.Leaderboard.activeRound;
                            this.totalRounds = this.Leaderboard.noOfRounds;
                            this.matchFormat = this.Leaderboard.matchFormat;
                            this.teamMatch = this.Leaderboard.teamMatch;
                            if (
                                this.matchFormat == matchFormat.TEXAS_SCRAMBLE
                            ) {
                                this.showTaxes = true;
                            }

                            if (this.Leaderboard.webLogoUrl)
                                this.webLogoUrl = this.Leaderboard.webLogoUrl;
                            this.Leaderboard.CategoriesQL.sort(
                                this.sortCategory
                            );
                            if (this.Leaderboard.CategoriesQL.length > 0) {
                                this.selectedCategory =
                                    this.Leaderboard.CategoriesQL[2];

                                if (!this.selectedCategoryValue)
                                    this.selectedCategoryValue =
                                        this.selectedCategory.category;
                            }

                            if (this.loggedInUser && this.loggedInUser.userRole)
                                if (
                                    this.loggedInUser.adminClubId ===
                                        this.Leaderboard.clubId &&
                                    this.activeRound <= this.totalRounds
                                )
                                    this.isClubAdmin = true;

                            //console.log(this.Leaderboard);

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

                            this.selectedSubTournament = this.tournamentID;

                            this.parseSubscriptionResponse(this.Leaderboard);

                            this.updateCategoryNames();
                            //resolve(data);
                        }
                    });
            });
    }
    private parseSubscriptionResponse(data: any): boolean {
        if (data == null) {
            return false;
        }
        let tournamentData: any = data;
        this.memberStatusesQLs = tournamentData.MemberStatusesQL;
        if (this.Leaderboard.noOfRounds > 1) {
            let index: number = 0;
            //console.log(this.cutOffList);
            if (this.Leaderboard.cutOffCriteria != null) {
                if ('cutOff' in this.Leaderboard.cutOffCriteria) {
                    for (let index in this.cutOffList['cutOff']) {
                        // //console.log(this.cutOffList[index]);
                        if (
                            this.cutOffList['cutOff'][index].name ==
                            this.selectedCategoryValue
                        ) {
                            let catCutOff = this.cutOffList['cutOff'][index];
                            this.cutOffLine = catCutOff;
                            this.cuttOffScore = catCutOff.score;
                            if (this.cutOffLine.copymembers > 0) {
                                this.cuttOffScore = 0;
                            }
                            break;
                        } else {
                            this.cuttOffScore = 0;
                            this.cutOffLine = [];
                        }
                    }

                    //console.log(this.Leaderboard);
                }
            }
            //console.log(this.cuttOffScore);
            for (let round = 1; round <= this.Leaderboard.noOfRounds; round++) {
                this.roundFlights[round - 1] =
                    this.Leaderboard.FlightsQL.filter((a) => {
                        return a.flightRound == round;
                    });

                //console.log(this.roundFlights[round - 1]);

                if (this.roundFlights[round - 1].length > 0) {
                    ////console.log("not null");

                    if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE) {
                        this.showTaxes = true;
                        this.createTexasScrampleLeaders(
                            this.roundFlights[round - 1],
                            round,
                            true
                        );
                    } else if (
                        this.matchFormat == matchFormat.BEST_THREE &&
                        this.teamMatch
                    )
                        this.createBestThreeLeaders(
                            this.roundFlights[round - 1],
                            round,
                            true
                        );
                    else if (
                        this.matchFormat == matchFormat.COMBINE_ALL &&
                        this.teamMatch
                    )
                        this.createBestThreeLeaders(
                            this.roundFlights[round - 1],
                            round,
                            true
                        );
                    else
                        this.createSimpleLeaders(
                            this.roundFlights[round - 1],
                            round,
                            true
                        );
                }

                index++;
            }
            this.isLoading = false;
            console.log(this.allMatchResults);
            let player: any = [];
            let grossAllArray: any[] = [];
            let netAllArray: any[] = [];
            let grossCutOffArray: any[] = [];
            let netCutOffArray: any[] = [];
            if (
                this.Leaderboard.cutOffCriteria != null &&
                'cutOff' in this.Leaderboard.cutOffCriteria &&
                this.Leaderboard.cutOffCriteria['cutOff'].length > 0 &&
                Object.keys(this.Leaderboard.cutOffCriteria).length > 0
            ) {
                if (
                    this.Leaderboard.cutOffCriteria.cutOff.length > 0 &&
                    this.cutOffLine.score > 0 &&
                    this.cutOffLine.type == 'GROSS' &&
                    this.cutOffLine.copymembers == null
                ) {
                    //console.log(this.cutOffLine);
                    for (let leader in this.allMatchResults) {
                        if (
                            this.cutOffList['cutOff'] &&
                            this.cutOffLine.score
                        ) {
                            let remove: any;

                            if (
                                this.allMatchResults[leader].AllGrossUnder >
                                    this.cuttOffScore &&
                                this.cuttOffScore > 0 &&
                                this.allMatchResults[leader].PlayingRound !=
                                    this.activeRound
                            ) {
                                remove = this.allMatchResults[leader];
                            }
                            if (remove) {
                                grossCutOffArray.push(remove);
                                netCutOffArray.push(remove);
                            } else {
                                if (
                                    this.activeRound -
                                        this.allMatchResults[leader]
                                            .PlayingRound >
                                    1
                                ) {
                                    remove = this.allMatchResults[leader];
                                }
                                if (remove) {
                                    grossCutOffArray.push(remove);
                                    netCutOffArray.push(remove);
                                } else {
                                    grossAllArray.push(
                                        this.allMatchResults[leader]
                                    );
                                    this.allllll.push(
                                        this.allMatchResults[leader]
                                    );
                                    netAllArray.push(
                                        this.allMatchResults[leader]
                                    );
                                    this.net.push(this.allMatchResults[leader]);
                                    //netCutOffArray.push(this.allMatchResults[leader]);
                                }
                            }

                            if (this.lastActiveTab == 1)
                                this.allRoundCutOff = true;
                            else if (this.lastActiveTab == 2)
                                this.allRoundCutOffNet = true;
                            else {
                                this.allRoundCutOff = true;
                            }
                        } else {
                            grossAllArray.push(this.allMatchResults[leader]);
                            this.allllll.push(this.allMatchResults[leader]);
                            netAllArray.push(this.allMatchResults[leader]);
                            this.net.push(this.allMatchResults[leader]);
                        }
                    }
                } else if (
                    this.Leaderboard.cutOffCriteria.cutOff.length > 0 &&
                    this.cutOffLine.score > 0 &&
                    this.cutOffLine.type == 'NET' &&
                    this.cutOffLine.copymembers == null
                ) {
                    for (let leader in this.allMatchResults) {
                        if (
                            this.cutOffList['cutOff'] &&
                            this.cutOffLine.score
                        ) {
                            let remove: any;
                            if (
                                this.allMatchResults[leader].AllNetUnder >
                                    this.cuttOffScore &&
                                this.cuttOffScore > 0 &&
                                this.allMatchResults[leader].PlayingRound !=
                                    this.activeRound
                            ) {
                                remove = this.allMatchResults[leader];
                            }
                            if (remove) {
                                grossCutOffArray.push(remove);

                                netCutOffArray.push(remove);
                            } else {
                                grossAllArray.push(
                                    this.allMatchResults[leader]
                                );
                                this.allllll.push(this.allMatchResults[leader]);
                                netAllArray.push(this.allMatchResults[leader]);
                                this.net.push(this.allMatchResults[leader]);
                                //netCutOffArray.push(this.allMatchResults[leader]);
                            }

                            if (this.lastActiveTab == 1)
                                this.allRoundCutOff = true;
                            else if (this.lastActiveTab == 2)
                                this.allRoundCutOffNet = true;
                            else {
                                this.allRoundCutOff = true;
                            }

                            // let catCutOff = this.cutOffList.score.filter((a) => {
                            //   return a.name == this.selectedCategoryValue;
                            // });

                            // for (let score of catCutOff) {
                            //   this.cuttOffScore = score.value;
                            // }
                        } else {
                            grossAllArray.push(this.allMatchResults[leader]);
                            this.allllll.push(this.allMatchResults[leader]);
                            netAllArray.push(this.allMatchResults[leader]);
                            this.net.push(this.allMatchResults[leader]);
                        }
                    }
                } else if (
                    this.cutOffList['cutOff'].length > 0 &&
                    this.cutOffLine.copymembers > 0
                ) {
                    for (let leader in this.allMatchResults) {
                        let remove: any;
                        if (
                            this.checkRoundCut(this.allMatchResults[leader]) ==
                            true
                        ) {
                            remove = this.allMatchResults[leader];
                        }
                        if (remove) {
                            grossCutOffArray.push(remove);
                            netCutOffArray.push(remove);
                        } else {
                            grossAllArray.push(this.allMatchResults[leader]);
                            this.allllll.push(this.allMatchResults[leader]);
                            netAllArray.push(this.allMatchResults[leader]);
                            this.net.push(this.allMatchResults[leader]);
                            //netCutOffArray.push(this.allMatchResults[leader]);
                        }
                    }
                } else {
                    for (let leader in this.allMatchResults) {
                        grossAllArray.push(this.allMatchResults[leader]);
                        //this.activePlayers.push(this.allMatchResults[leader]);
                        this.allllll.push(this.allMatchResults[leader]);
                        netAllArray.push(this.allMatchResults[leader]);
                        this.net.push(this.allMatchResults[leader]);
                    }
                    //console.log(this.activePlayers);
                }
                grossAllArray.sort(this.ComparatorAllGross);
                netAllArray.sort(this.ComparatorAllNet);
                this.allLeadersGross =
                    this.allllll.length > 0 ||
                    this.cuttOffScore > 0 ||
                    !this.cutOffList
                        ? this.sortAllGrossLeadersTie(grossAllArray)
                        : this.allLeadersGross;

                this.allLeadersNet =
                    this.net.length > 0 ||
                    this.cuttOffScore > 0 ||
                    !this.cutOffList
                        ? this.sortAllNetLeadersTie(netAllArray)
                        : this.allLeadersNet; //this.allLeadersNet = this.sortNetLeaders(netAllArray);
                this.allLeadersCutOffGross =
                    this.sortAllGrossLeadersTie(grossCutOffArray);

                if (this.allLeadersCutOffGross.length > 0) {
                    this.isCuttOffRequired = true;
                    //console.log(this.allLeadersCutOffGross.length);
                } else {
                    this.isCuttOffRequired = false;
                    //console.log(this.allLeadersCutOffGross.length);
                }

                this.allLeadersCutOffNet =
                    this.sortAllNetLeadersTie(netCutOffArray);

                if (this.flightRound && this.flightRound != 0) {
                    ////console.log(this.grossLeaders);
                    this.getPreviousSelection();
                    ////console.log("ALLAH IS ONE");
                } else {
                    ////console.log("ALLAH IS GREAT");
                    this.flightRound = 0;

                    this.isGross = false;
                    this.isNet = false;

                    if (this.lastActiveTab == 1) {
                        this.allRoundGrossScore = true;
                        this.allRoundNetScore = false;
                    } else {
                        this.allRoundGrossScore = false;
                        this.allRoundNetScore = true;
                    }
                }

                //this.allRoundCutOff = false;

                //this.allRoundCutOffNet = false;
            } else {
                console.log(this.allMatchResults);

                for (let leader in this.allMatchResults) {
                    grossAllArray.push(this.allMatchResults[leader]);
                    this.allllll.push(this.allMatchResults[leader]);
                    netAllArray.push(this.allMatchResults[leader]);
                    this.net.push(this.allMatchResults[leader]);
                }
                grossAllArray.sort(this.ComparatorAllGross);
                netAllArray.sort(this.ComparatorAllNet);
                this.allLeadersGross =
                    this.allllll.length > 0 ||
                    this.cuttOffScore > 0 ||
                    !this.cutOffList
                        ? this.sortAllGrossLeadersTie(grossAllArray)
                        : this.allLeadersGross;

                this.allLeadersNet =
                    this.net.length > 0 ||
                    this.cuttOffScore > 0 ||
                    !this.cutOffList
                        ? this.sortAllNetLeadersTie(netAllArray)
                        : this.allLeadersNet; //this.allLeadersNet = this.sortNetLeaders(netAllArray);
                this.allLeadersCutOffGross =
                    this.sortAllGrossLeadersTie(grossCutOffArray);
                //console.log(this.allLeadersCutOffGross.length);
                //console.log(this.allLeadersCutOffGross);

                if (this.allLeadersCutOffGross.length > 0) {
                    this.isCuttOffRequired = true;
                    //console.log(this.allLeadersCutOffGross.length);
                } else {
                    this.isCuttOffRequired = false;
                    //console.log(this.allLeadersCutOffGross.length);
                }

                this.allLeadersCutOffNet =
                    this.sortAllNetLeadersTie(netCutOffArray);

                if (this.flightRound && this.flightRound != 0) {
                    ////console.log(this.grossLeaders);
                    this.getPreviousSelection();
                    ////console.log("ALLAH IS ONE");
                } else {
                    ////console.log("ALLAH IS GREAT");
                    this.flightRound = 0;

                    this.isGross = false;
                    this.isNet = false;

                    if (this.lastActiveTab == 1) {
                        this.allRoundGrossScore = true;
                        this.allRoundNetScore = false;
                    } else {
                        this.allRoundGrossScore = false;
                        this.allRoundNetScore = true;
                    }
                }

                return true;
            }
           
        } else {
            if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                this.createTexasScrampleLeaders(
                    this.Leaderboard.FlightsQL,
                    1,
                    false
                );
            else if (
                this.matchFormat == matchFormat.BEST_THREE &&
                this.teamMatch
            )
                this.createBestThreeLeaders(
                    this.Leaderboard.FlightsQL,
                    1,
                    false
                );
            else if (
                this.matchFormat == matchFormat.COMBINE_ALL &&
                this.teamMatch
            )
                this.createBestThreeLeaders(
                    this.Leaderboard.FlightsQL,
                    1,
                    false
                );
            else this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);

            this.flightRound = 1;

            if (this.lastActiveTab == 1) {
                this.isGross = true;
                this.isNet = false;
            } else {
                this.isGross = false;
                this.isNet = true;
            }

            this.allRoundGrossScore = false;
            this.allRoundCutOff = false;

            this.allRoundNetScore = false;
            this.allRoundCutOffNet = false;
            this.isCuttOffRequired = false;

            this.lastActiveTab == 1;
            this.isLoading = false;
        }
        this.isLoading = false;
    }

    private createSimpleLeaders(
        flightsQLs: any[],
        round: number,
        flag: boolean
    ) {
        ////console.log("calling me once....");
        this.playerScores = [];

        let handicapAllocation: string = this.getHandicapAllocation();

        for (let flightData of flightsQLs) {
            ////console.log("Flight ID: " + flightData.id);
            let membersQLs: any = flightData.MembersQL;

            for (let membersQL of membersQLs) {
                ////console.log(membersQL);
                let playerId: String = membersQL.playerId;
                //let playerQL:Player = membersQL.PlayerQL;

                //this.players.push(playerQL);

                let player: Player = membersQL.PlayerQL;
                ////console.log(player);
                if (player == null) {
                    continue;
                }

                let allStatus: any = this.memberStatusesQLs;
                let playerStatus: any;

                if (allStatus) {
                    playerStatus = allStatus.find(
                        (s) => s.playerId === playerId
                    );
                }

                if (this.selectedCategoryValue != null) {
                    let handicapLimits: any =
                        this.selectedCategory.handicapLimits;

                    ////console.log(player.playerCategory + " -- " + this.selectedCategory.category);
                    if (player.playerCategory !== this.selectedCategoryValue) {
                        continue;
                    }

                    if (this.selectedCategory.handicapLimits != null) {
                        // Skip this player if not in the selected handicap range

                        //let handicap:number = player.handicap;
                        ////console.log("getting data");
                        if (
                            this.isPlayerCategoryToSkip(
                                player.playerCategory,
                                player.handicap
                            )
                        )
                            continue;
                    }
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
                        score.hole.index,
                        score.hole.par,
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
                    ////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.HoleIPQL.holeNo);
                }

                let playerHole18ScoreGross: any[] = [];
                let playerHole18ScoreNet: any[] = [];

                for (let i = 0; i < flightData.CourseQL.noOfHoles; i++) {
                    let hole = scores.find((a) => {
                        return a.hole.holeNo == i + 1;
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
                    holesPlayed >= this.noOfHolesInCourse * flightIds.length;

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
                    status: 0,
                    extraData: extraData,
                    under: grossUnderTotal,
                    points: stableFordPointsTotal,
                    holes: holesPlayed,
                    completed: completed,
                    holeScores: playerHole18ScoreGross,
                    holeScoreLast18: this.getLastHolesTotal(
                        18,
                        playerHole18ScoreGross
                    ),
                    holeScoreLast9: this.getLastHolesTotal(
                        9,
                        playerHole18ScoreGross
                    ),
                    holeScoreLast6: this.getLastHolesTotal(
                        6,
                        playerHole18ScoreGross
                    ),
                    holeScoreLast3: this.getLastHolesTotal(
                        3,
                        playerHole18ScoreGross
                    ),
                    holeScoreLast1: this.getLastHolesTotal(
                        1,
                        playerHole18ScoreGross
                    ),
                    playerStatus: playerStatus ? playerStatus.status : 'ac',
                };

                this.grossLeaders.push(LeaderGross);
                //console.log('Gross:' + this.grossLeaders);

                this.grossAllLeaders.push(LeaderGross);
                //console.log(this.grossAllLeaders);

                let LeaderNet: any = {
                    position: 0,
                    tied: false,
                    playerId: playerId,
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
                    holeScoreLast18: this.getLastHolesTotal(
                        18,
                        playerHole18ScoreNet
                    ),
                    holeScoreLast9: this.getLastHolesTotal(
                        9,
                        playerHole18ScoreNet
                    ),
                    holeScoreLast6: this.getLastHolesTotal(
                        6,
                        playerHole18ScoreNet
                    ),
                    holeScoreLast3: this.getLastHolesTotal(
                        3,
                        playerHole18ScoreNet
                    ),
                    holeScoreLast1: this.getLastHolesTotal(
                        1,
                        playerHole18ScoreNet
                    ),
                    playerStatus: playerStatus ? playerStatus.status : 'ac',
                };

                this.netLeaders.push(LeaderNet);
                this.netAllLeaders.push(LeaderNet);
                //console.log(this.netAllLeaders);

                if (flag) this.calculateTotal(LeaderGross, LeaderNet, round);
            }
        }
        console.log(this.grossLeaders);
        if (this.isGross == true || this.isNet == true) {
            this.sortLeaders(this.grossLeaders);
            this.sortLeaders(this.netLeaders);
        }
      
    }

    private calculateTotal(leaderGross: any, leaderNet: any, round: number) {
        // let status: any = this.memberStatusesQLs.find(
        //   (s) => s.playerId === leaderGross.playerId
        // );

        // if (status && this.activeRound > 1) return false;
        console.log(this.allMatchResults);

        if (leaderGross.playerId in this.allMatchResults) {
            ////console.log("index exist");
        } else {
            this.allMatchResults[leaderGross.playerId] = [];

            this.allMatchResults[leaderGross.playerId]['position'] = '';

            this.allMatchResults[leaderGross.playerId][
                'TotalGross' + round
            ] = 0;
            this.allMatchResults[leaderGross.playerId]['TotalNet' + round] = 0;
            this.allMatchResults[leaderGross.playerId]['roundStatus' + round] =
                leaderGross.status;
            this.allMatchResults[leaderGross.playerId][
                'TotalGrossUnder' + round
            ] = 0;
            this.allMatchResults[leaderGross.playerId]['AllGrossUnder'] = 0;
            this.allMatchResults[leaderGross.playerId]['AllGrossPoints'] = 0;
            this.allMatchResults[leaderGross.playerId]['AllNetPoints'] = 0;

            this.allMatchResults[leaderGross.playerId][
                'TotalNetUnder' + round
            ] = 0;
            this.allMatchResults[leaderGross.playerId]['AllNetUnder'] = 0;
            this.allMatchResults[leaderGross.playerId]['points' + round] += 0;
            this.allMatchResults[leaderGross.playerId]['holes' + round] += 0;

            ////console.log("index created");
        }

        if (!this.allMatchResults[leaderGross.playerId]['TotalGross' + round])
            this.allMatchResults[leaderGross.playerId][
                'TotalGross' + round
            ] = 0;

        if (!this.allMatchResults[leaderGross.playerId]['TotalNet' + round])
            this.allMatchResults[leaderGross.playerId]['TotalNet' + round] = 0;

        if (
            !this.allMatchResults[leaderGross.playerId][
                'TotalGrossUnder' + round
            ]
        )
            this.allMatchResults[leaderGross.playerId][
                'TotalGrossUnder' + round
            ] = 0;

        if (
            !this.allMatchResults[leaderGross.playerId]['TotalNetUnder' + round]
        )
            this.allMatchResults[leaderGross.playerId][
                'TotalNetUnder' + round
            ] = 0;

        this.allMatchResults[leaderGross.playerId]['position'] = '';
        this.allMatchResults[leaderGross.playerId]['courseId'] =
            leaderGross.courseId;
        this.allMatchResults[leaderGross.playerId]['holeSets'] =
            leaderGross.holeSets;
        this.allMatchResults[leaderGross.playerId]['playerId'] =
            leaderGross.playerId;
        this.allMatchResults[leaderGross.playerId]['name'] = leaderGross.name;
        this.allMatchResults[leaderGross.playerId]['picture'] =
            leaderGross.picture;
        this.allMatchResults[leaderGross.playerId]['handicap'] =
            leaderGross.handicap;
        this.allMatchResults[leaderGross.playerId]['TotalGross' + round] +=
            leaderGross.score;
        this.allMatchResults[leaderGross.playerId]['TotalNet' + round] +=
            leaderNet.score;
        this.allMatchResults[leaderGross.playerId]['roundStatus' + round] =
            leaderGross.status;
        this.allMatchResults[leaderGross.playerId]['extraData'] =
            leaderGross.extraData;

        this.allMatchResults[leaderGross.playerId]['TotalGrossUnder' + round] +=
            leaderGross.under;
        this.allMatchResults[leaderGross.playerId]['AllGrossUnder'] +=
            leaderGross.under;
        this.allMatchResults[leaderGross.playerId]['PlayingRound'] =
            leaderGross.playingRound;
        this.allMatchResults[leaderGross.playerId]['holeSetsInverted'] =
            leaderGross.holeSetsInverted;
        this.allMatchResults[leaderGross.playerId]['AllGrossPoints'] +=
            leaderGross.score;
        this.allMatchResults[leaderGross.playerId]['TotalNetUnder' + round] +=
            leaderNet.under;
        this.allMatchResults[leaderGross.playerId]['AllNetUnder'] +=
            leaderNet.under;
        this.allMatchResults[leaderGross.playerId]['AllNetPoints'] +=
            leaderNet.score;
        this.allMatchResults[leaderGross.playerId]['points' + round] =
            leaderGross.points;
        this.allMatchResults[leaderGross.playerId]['holes' + round] =
            leaderGross.holes;
        this.allMatchResults[leaderGross.playerId]['completed' + round] =
            leaderGross.completed;
        this.allMatchResults[leaderGross.playerId]['holeScoreLast9'] =
            leaderGross.holeScoreLast9;
        this.allMatchResults[leaderGross.playerId]['holeScoreLast6'] =
            leaderGross.holeScoreLast6;
        this.allMatchResults[leaderGross.playerId]['holeScoreLast3'] =
            leaderGross.holeScoreLast3;
        this.allMatchResults[leaderGross.playerId]['holeScoreLast1'] =
            leaderGross.holeScoreLast1;

        this.allMatchResults[leaderGross.playerId]['activeRound'] =
            this.activeRound;
        this.allMatchResults[leaderGross.playerId]['totalRounds'] =
            this.totalRounds;

        status
            ? (this.allMatchResults[leaderGross.playerId]['status'] = 1)
            : (this.allMatchResults[leaderGross.playerId]['status'] = 0);

        this.allMatchResults[leaderGross.playerId]['playerStatus'] =
            leaderGross.playerStatus;

        ////console.log(leaderGross.playerId + " -> " + "TotalGross" + round + " "  + this.allMatchResults[leaderGross.playerId]["TotalGross" + round]);
        return false;
    }

    private sortLeaders(arrayLeaders: any): any[] {
        // console.log(arrayLeaders);

        if (this.isGross == true || this.isNet == true) {
            arrayLeaders = arrayLeaders.sort(this.ComparatorRound);
        } else {
            arrayLeaders = arrayLeaders.sort(this.Comparator);
        }
        console.log(arrayLeaders);

        let rankGrossCntr: number = 1;
        let preGrossScore: number = 999;
        let preGrossRank: number = 1;

        for (let i = 0; i < arrayLeaders.length; i++) {
            ////console.log(allR.SubtotalGrossUnder + " <<---->> " + preScore);
            if (arrayLeaders[i].under == preGrossScore) {
                arrayLeaders[i - 1]['position'] = 'T' + preGrossRank;
                arrayLeaders[i]['position'] = 'T' + preGrossRank;
                ////console.log("same-> " + $scope.allleaderboardstotal[index]["rank"]);
            } else {
                arrayLeaders[i]['position'] = rankGrossCntr;
                preGrossRank = rankGrossCntr;
                ////console.log("new-> " + $scope.allleaderboardstotal[index]["rank"]);
            }

            preGrossScore = arrayLeaders[i].under;
            ////console.log($scope.allleaderboardstotal[index]["rank"]);
            ////console.log(index);

            rankGrossCntr++;
        }
        return arrayLeaders;
    }

    checkRoundCut(Player): boolean {
        this.activeRound = this.Leaderboard.activeRound;
        let round = this.activeRound;
        if (round == 3) {
            if (this.activeRound - Player.PlayingRound > 1) {
                this.activeRound = 2;
                return true;
            } else {
                return false;
            }
        } else if (round == 4) {
            if (this.activeRound - Player.PlayingRound > 2) {
                this.activeRound = 2;
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
    Comparator(a, b) {
        // console.log(this.tournamentID);
        // console.log(this.activeRound);

        // if (a['holes'] == 0 && a['under'] == 0) return 1;
        // if (b['holes'] == 0 && b['under'] == 0) return 1;
        if (a['under'] < b['under']) return -1;
        if (a['under'] > b['under']) return 1;
        return 0;
    }
    ComparatorRound(a, b) {
        if (a['under'] < b['under']) return -1;
        if (a['under'] > b['under']) return 1;
        return 0;
    }

    sortCategory(a, b) {
        if (a['category'] < b['category']) {
            return -1;
        }
        if (a['category'] > b['category']) {
            return 1;
        }
        return 0;
    }

    ComparatorScore(a, b) {
        if (a['score'] < b['score']) return -1;
        if (a['score'] > b['score']) return 1;
        return 0;
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

    ComparatorAllGrossPosition(a, b) {
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

        // if (a.holes1 < b.holes1) {
        //     return 1;
        // }

        // if (a.holes1 < b.holes1) {
        //     return 1;
        // }
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
            compare = a.AllGrossUnder - b.AllGrossUnder;

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
            compare = a.AllNetUnder - b.AllNetUnder;

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

    ComparatorAllGross(a, b) {
        // if(a['holes2']==0) return 1;
        // if(b['holes2']==0) return 1;
        // if (a['holes2'] >= b['holes2'] ) return -1;
        // if (a['holes2'] <= b['holes2'] ) return 1;

        if (a['AllGrossUnder'] < b['AllGrossUnder']) return -1;
        if (a['AllGrossUnder'] > b['AllGrossUnder']) return 1;

        return 0;
    }

    ComparatorAllNet(a, b) {
        if (a['AllNetUnder'] < b['AllNetUnder']) return -1;
        if (a['AllNetUnder'] > b['AllNetUnder']) return 1;
        return 0;
    }

    getHandicapAllocation(): string {
        let hcAllocation: string;

        if (this.Leaderboard.handicapAllocations)
            hcAllocation =
                this.Leaderboard.handicapAllocations['handicapAllocation'];
        else hcAllocation = handicapAllocation.AS_IS;

        return hcAllocation;
    }

    private sortLeadersTie(leaderList: any[]) {
        //Collections.sort(grossLeaders);
        ////console.log(leaderList);

        leaderList = leaderList.sort(this.ComparatorPosition);
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

            tied = leaderCurrent.under == leaderPrevious.under;
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

    private sortAllGrossLeadersTie(leaderGrossList: any[]) {
        //Collections.sort(grossLeaders);
        console.log(leaderGrossList);

        leaderGrossList = leaderGrossList.sort(this.ComparatorAllGrossPosition);
        console.log(leaderGrossList);
        ////console.log(leaderList);
        //return false;

        let pos: number = 1;
        let tied: boolean;

        if (leaderGrossList.length > 0) leaderGrossList[0]['position'] = pos;

        ////console.log(leaderList);
        for (let i = 1; i < leaderGrossList.length; i++) {
            let leaderCurrent = leaderGrossList[i];
            let leaderPrevious = leaderGrossList[i - 1];
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

            tied = leaderCurrent.AllGrossUnder == leaderPrevious.AllGrossUnder;

            if (tied) {
                //leaderCurrent["tied"]= true;
                //leaderPrevious["tied"]= true;
                leaderGrossList[i]['tied'] = true;
                leaderGrossList[i - 1]['tied'] = true;
                leaderGrossList[i]['position'] = 'T' + pos;
                leaderGrossList[i - 1]['position'] = 'T' + pos;
            } else {
                pos = i + 1;
                leaderGrossList[i]['position'] = pos;
            }
            ////console.log(pos);

            ////console.log("position-> " + pos + " -->" + leaderCurrent.name);
        }
        //console.log(leaderGrossList);

        return leaderGrossList;
    }

    private sortAllNetLeadersTie(leaderList: any[]) {
        //Collections.sort(grossLeaders);
        ////console.log(leaderList);

        leaderList = leaderList.sort(this.ComparatorAllNetPosition);
        ////console.log(leaderList);
        //return false;

        let pos: number = 1;
        let tied: boolean;

        if (leaderList.length > 0) leaderList[0]['positionNet'] = pos;
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

            tied = leaderCurrent.AllNetUnder == leaderPrevious.AllNetUnder;

            if (tied) {
                //leaderCurrent["tied"]= true;
                //leaderPrevious["tied"]= true;
                leaderList[i]['tied'] = true;
                leaderList[i - 1]['tied'] = true;
                leaderList[i]['positionNet'] = 'T' + pos;
                leaderList[i - 1]['positionNet'] = 'T' + pos;
            } else {
                pos = i + 1;
                leaderList[i]['positionNet'] = pos;
            }
            ////console.log(pos);

            ////console.log("position-> " + pos + " -->" + leaderCurrent.name);
        }
        //leaderList = leaderList.sort(this.ComparatorAllGrossPosition);
        ////console.log("return");
        return leaderList;
    }

    public getLastHolesTotal(noOfHoles: number, holeScores: any[]): number {
        let total: number = 0;

        for (let i = holeScores.length - 1; i >= 0 && noOfHoles > 0; i--) {
            total += holeScores[i];
            noOfHoles--;
        }

        return total;
    }

    selectionChanged(item) {
        this.activeRound = this.Leaderboard.activeRound;
        if (this.flightRound == 0) {
            if (item.value == LeaderTypeValue.GROSS) {
                ////console.log("Selected value: " + item.value);
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;

                this.isGross = false;
                this.isNet = false;
                this.lastActiveTab = 1;
            } else if (item.value == LeaderTypeValue.NET) {
                ////console.log("Selected value: " + item.value);
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = true;
                this.allRoundCutOffNet = true;
                this.isNet = false;
                this.isGross = false;
                this.lastActiveTab = 2;
            } else {
            }
        } else {
            if (item.value == LeaderTypeValue.GROSS) {
                ////console.log("Selected value: " + item.value);
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.lastActiveTab = 1;
            } else if (item.value == LeaderTypeValue.NET) {
                ////console.log("Selected value: " + item.value);
                this.isNet = true;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.lastActiveTab = 2;
            } else {
            }
        }
        ////console.log("isGross: " + this.isGross);
        ////console.log("isNet: " + this.isNet);

        ////this.selectedValue.forEach(i => //console.log(`Included Item: ${i}`));
    }

    changeCategory(item) {
        this.activeRound = this.Leaderboard.activeRound;
        if (this.flightRound == 0) {
            this.selectedCategory = null;
            this.allRoundGrossScore = true;
            this.allRoundCutOff = true;

            this.allRoundNetScore = false;
            this.allRoundCutOffNet = false;

            this.isGross = false;
            this.isNet = false;

            if (this.lastActiveTab == 1) {
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.isGross = false;
                this.isNet = false;
            } else if (this.lastActiveTab == 2) {
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = true;
                this.allRoundCutOffNet = true;
                this.isNet = false;
                this.isGross = false;
            } else {
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;

                this.isGross = false;
                this.isNet = false;
            }

            //   this.allRoundScore = false;

            let originalCategory: string = '';
            if (item.value.search('#') == -1) {
                originalCategory = item.value;
            } else {
                let splitted = item.value.split('#', 3);
                originalCategory = splitted[0];
                this.categoryLimit = splitted[1];
            }

            this.selectedCategory = this.Leaderboard.CategoriesQL.find(
                (c) => c.category === originalCategory
            );
            this.selectedCategoryValue = this.selectedCategory.category;

            this.grossLeaders = [];
            this.netLeaders = [];
            this.grossAllLeaders = [];
            this.netAllLeaders = [];
            this.allMatchResults = [];

            this.parseSubscriptionResponse(this.Leaderboard);
        } else {
            let originalCategory: string = '';
            if (item.value.search('#') == -1) {
                originalCategory = item.value;
            } else {
                let splitted = item.value.split('#', 3);
                originalCategory = splitted[0];
                this.categoryLimit = splitted[1];
            }

            this.selectedCategory = this.Leaderboard.CategoriesQL.find(
                (c) => c.category === originalCategory
            );
            this.selectedCategoryValue = this.selectedCategory.category;

            if (this.lastActiveTab == 1) {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else if (this.lastActiveTab == 2) {
                this.isNet = true;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            }

            // this.allRoundScore = false;

            this.grossLeaders = [];
            this.netLeaders = [];
            this.grossAllLeaders = [];
            this.netAllLeaders = [];

            if (this.Leaderboard.noOfRounds > 1) {
                //this.createSimpleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false);
                //(this.matchFormat == matchFormat.TEXAS_SCRAMBLE)? this.createTexasScrampleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false) : this.createSimpleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false);
                if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                    this.createTexasScrampleLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.BEST_THREE &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.COMBINE_ALL &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else
                    this.createSimpleLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
            } else {
                //this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);
                //(this.matchFormat == matchFormat.TEXAS_SCRAMBLE)? this.createTexasScrampleLeaders(this.Leaderboard.FlightsQL, 1, false) : this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);
                if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                    this.createTexasScrampleLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.BEST_THREE &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.COMBINE_ALL &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else
                    this.createSimpleLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
            }
        }
    }

    changeRound(item) {
        ////console.log("Selected value: " + item.value);

        this.flightRound = item.value;

        if (item.value == '0') {
            //console.log(this.lastActiveTab);
            if (this.lastActiveTab == 1) {
                this.isGross = false;
                this.isNet = false;
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else if (this.lastActiveTab == 2) {
                this.isNet = false;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = true;
                this.allRoundCutOffNet = true;
            } else {
                this.isGross = false;
                this.isNet = false;
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            }
            //console.log(this.allRoundCutOff);

            this.grossLeaders = [];
            this.netLeaders = [];
            this.grossAllLeaders = [];
            this.netAllLeaders = [];
            this.allMatchResults = [];

            this.parseSubscriptionResponse(this.Leaderboard);
        } else {
            if (this.lastActiveTab == 1) {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else if (this.lastActiveTab == 2) {
                this.isNet = true;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            }

            //   this.allRoundScore = false;

            this.grossLeaders = [];
            this.netLeaders = [];
            this.grossAllLeaders = [];
            this.netAllLeaders = [];

            if (this.Leaderboard.noOfRounds > 1) {
                //this.createSimpleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false);
                //(this.matchFormat == matchFormat.TEXAS_SCRAMBLE)? this.createTexasScrampleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false) : this.createSimpleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false);
                if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                    this.createTexasScrampleLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.BEST_THREE &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.COMBINE_ALL &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else
                    this.createSimpleLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
            } else {
                //this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);
                //(this.matchFormat == matchFormat.TEXAS_SCRAMBLE)? this.createTexasScrampleLeaders(this.Leaderboard.FlightsQL, 1, false) : this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);
                if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                    this.createTexasScrampleLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.BEST_THREE &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.COMBINE_ALL &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else
                    this.createSimpleLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
            }
        }
        ////console.log(this.allMatchResults);
    }
    viewPlayerScore(
        name: string,
        courseId: string,
        courseHoleSets: string,
        playerId: string,
        holeSetsInverted: string,
        scoreType: string
    ) {
        let playerGrossScore: any;
        let playerNetScore: any;
        let playerPerTeam: any[];
        let team: boolean = false;
        let removed: string[] = [];
        //console.log(playerId);

        if (this.flightRound == 0) {
            playerGrossScore = this.grossAllLeaders.filter((g) => {
                return g.playerId == playerId;
            });

            playerNetScore = this.netAllLeaders.filter((g) => {
                return g.playerId == playerId;
            });
        } else {
            playerGrossScore = this.grossLeaders.filter((g) => {
                return g.playerId == playerId;
            });

            playerNetScore = this.netLeaders.filter((g) => {
                return g.playerId == playerId;
            });
        }
        playerPerTeam = this.Leaderboard.FlightsQL.filter((a) => {
            return a.id == playerId;
        });

        ////console.log(playerGrossScore);
        if (
            this.teamMatch &&
            (this.matchFormat == matchFormat.BEST_THREE ||
                this.matchFormat == matchFormat.COMBINE_ALL)
        ) {
            removed =
                playerGrossScore.length > 0 && playerGrossScore[0].removedScore
                    ? playerGrossScore[0].removedScore
                    : [];
            playerGrossScore =
                playerGrossScore.length > 0
                    ? playerGrossScore[0].holeScores
                    : [];
            playerNetScore =
                playerNetScore.length > 0 ? playerNetScore[0].holeScores : [];

            if (!removed) removed = [];

            team = true;
        }
        if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE) {
            const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
                data: {
                    name: name,
                    tee_id:
                        this.Leaderboard.tee_id != null
                            ? this.Leaderboard.tee_id
                            : 1,
                    course: courseId,
                    players: playerPerTeam[0]['MembersQL'],
                    holeSets: courseHoleSets,
                    courseHoleSetsInverted: holeSetsInverted,
                    allGross: playerGrossScore,
                    allNet: playerNetScore,
                    round: this.flightRound,
                    type: scoreType,
                    team: team,
                    removed: removed,
                },
            });
        } else {
            const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
                data: {
                    name: name,
                    tee_id:
                        this.Leaderboard.tee_id != null
                            ? this.Leaderboard.tee_id
                            : 1,
                    course: courseId,
                    holeSets: courseHoleSets,
                    allGross: playerGrossScore,
                    courseHoleSetsInverted: holeSetsInverted,
                    allNet: playerNetScore,
                    round: this.flightRound,
                    type: scoreType,
                    team: team,
                    removed: removed,
                },
            });
        }
    }

    private createTexasScrampleLeaders(
        flightsQLs: any[],
        round: number,
        flag: boolean
    ) {
        ////console.log("calling me once....");
        this.playerScores = [];

        let handicapAllocation: string = this.getHandicapAllocation();

        for (let flightData of flightsQLs) {
            //console.log(flightData);

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
                let player: Player = membersQL.PlayerQL;
                //console.log(membersQL);

                ////console.log(player);
                if (player == null) {
                    continue;
                }

                // let actRound: number =
                //   this.activeRound > this.totalRounds
                //     ? this.totalRounds
                //     : this.activeRound;
                // if (actRound == round) this.activePlayers.push(player);

                // //console.log("handicap-> "+ membersQL["ScoresQL"][0].playerHandicap);
                if (membersQL['ScoresQL'].length > 0) {
                    combinedHandicap += membersQL['ScoresQL'][0].playerHandicap
                        ? membersQL['ScoresQL'][0].playerHandicap
                        : 0;
                } else {
                    combinedHandicap += 0;
                }
                // //console.log("combined-> " + combinedHandicap);
                playerCategory = player.playerCategory;

                scores = membersQL['ScoresQL'];
            }

            let flightIds: String[] = [];
            let cntr: number = 0;

            if (scores.length <= 0) continue;
            //console.log(scores);

            for (let score of scores) {
                let objScore: Score = new Score(
                    score.playerId,
                    score.playerHandicap,
                    score.hole.index,
                    score.hole.par,
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
                ////console.log(membersQLs.length + "<<.>>" + combinedHandicap);
                // if(handicapAloc==handicapAllocation.)
                scoreHandicap = objScore.getPlayerTSHandicaps(
                    handicapAllocation,
                    membersQLs.length,
                    combinedHandicap
                );
                ////console.log(scoreHandicap);

                holesPlayed++;

                if (!flightIds.includes(score.flightId)) {
                    flightIds.push(score.flightId);
                }
                cntr++;
            }

            let playerHole18ScoreGross: any[] = [];
            let playerHole18ScoreNet: any[] = [];
            if (flightData.courseHoleSets == 12) {
                for (let i = 0; i < flightData.CourseQL.noOfHoles; i++) {
                    let hole = scores.find((a) => {
                        return a.hole.holeNo == i + 1;
                    });
                    //console.log(hole);

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
                        return a.hole.holeNo == i + 1;
                    });
                    //console.log(hole);

                    if (hole) {
                        playerHole18ScoreGross[i] = hole.grossScore;
                        playerHole18ScoreNet[i] = hole.netScore;
                    } else {
                        playerHole18ScoreGross[i] = 0;
                        playerHole18ScoreNet[i] = 0;
                    }
                }
            }

            ////console.log(scoreHandicap + " " + grossTotal);
            netTotal = grossTotal - scoreHandicap;

            //console.log(netTotal);
            netUnderTotal = grossUnderTotal - scoreHandicap;

            let name: string = flightData.name['name'];
            handicap = scoreHandicap;
            let completed: boolean =
                holesPlayed > 0 &&
                holesPlayed >= this.noOfHolesInCourse * flightIds.length;

            let LeaderGross: any = {
                position: 0,
                tied: false,
                courseId: flightData['CourseQL'].id,
                playerId: flightData.id,
                name: name,
                holeSets: flightData.courseHoleSets,
                holeSetsInverted: flightData.courseHoleSetsInverted
                    ? flightData.courseHoleSetsInverted
                    : false,
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
                holeScores: playerHole18ScoreGross,
                holeScoreLast18: this.getLastHolesTotal(
                    18,
                    playerHole18ScoreGross
                ),
                holeScoreLast9: this.getLastHolesTotal(
                    9,
                    playerHole18ScoreGross
                ),
                holeScoreLast6: this.getLastHolesTotal(
                    6,
                    playerHole18ScoreGross
                ),
                holeScoreLast3: this.getLastHolesTotal(
                    3,
                    playerHole18ScoreGross
                ),
                holeScoreLast1: this.getLastHolesTotal(
                    1,
                    playerHole18ScoreGross
                ),
            };

            this.grossLeaders.push(LeaderGross);
            this.grossAllLeaders.push(LeaderGross);
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
                position: 0,
                tied: false,
                playerId: flightData.id,
                courseId: flightData['CourseQL'].id,
                holeSets: flightData.courseHoleSets,
                name: name,
                picture: '',
                holeSetsInverted: flightData.courseHoleSetsInverted
                    ? flightData.courseHoleSetsInverted
                    : false,
                handicap: scoreHandicap,
                score: netTotal,
                type: LeaderType.NET,
                status: status ? 1 : 0,
                extraData: '',
                under: netUnderTotal,
                points: '',
                holes: holesPlayed,
                completed: completed,
                holeScores: playerHole18ScoreNet,
                holeScoreLast18: this.getLastHolesTotal(
                    18,
                    playerHole18ScoreNet
                ),
                holeScoreLast9: this.getLastHolesTotal(9, playerHole18ScoreNet),
                holeScoreLast6: this.getLastHolesTotal(6, playerHole18ScoreNet),
                holeScoreLast3: this.getLastHolesTotal(3, playerHole18ScoreNet),
                holeScoreLast1: this.getLastHolesTotal(1, playerHole18ScoreNet),
            };

            this.netLeaders.push(LeaderNet);
            this.netAllLeaders.push(LeaderNet);

            if (flag) this.calculateTotal(LeaderGross, LeaderNet, round);
        }
        //this.sortLeaders(this.grossLeaders);

        this.sortLeadersTie(this.grossLeaders);
        this.sortLeadersTie(this.netLeaders);
        ////console.log(this.grossLeaders);
        ////console.log(this.netLeaders);

        //this.sortLeaders(this.netLeaders);

        //return { gross: this.grossLeaders, net: this.netLeaders };
    }

    private createBestThreeLeaders(
        flightsQLs: any[],
        round: number,
        flag: boolean
    ) {
        ////console.log("calling me once....");
        this.playerScores = [];

        let handicapAllocation: string = this.getHandicapAllocation();

        for (let flightData of flightsQLs) {
            let flightGrossLeaders: any = [];
            let flightNetLeaders: any = [];
            let maxHolesPlayed = 0;
            ////console.log("Flight ID: " + flightData.id);
            let membersQLs: any = flightData.MembersQL;
            ////console.log(membersQLs);
            for (let membersQL of membersQLs) {
                ////console.log(membersQL);
                let playerId: String = membersQL.playerId;
                //let playerQL:Player = membersQL.PlayerQL;

                //this.players.push(playerQL);

                let player: Player = membersQL.PlayerQL;
                ////console.log(player);
                if (player == null) {
                    continue;
                }

                let actRound: number =
                    this.activeRound > this.totalRounds
                        ? this.totalRounds
                        : this.activeRound;
                if (actRound == round) this.activePlayers.push(player);

                let allStatus: any = this.memberStatusesQLs;

                if (allStatus) {
                    let playerStatus: any = allStatus.find(
                        (s) => s.playerId === playerId
                    );
                    //console.log(playerStatus);
                    if (playerStatus && playerStatus.status == 'ic') continue;
                }

                //this.selectedCategory = this.categories[1];

                ////console.log(this.selectedCategory);
                ////console.log(this.category.handicapLimits);

                if (this.selectedCategoryValue != null) {
                    // Skip this player if not belonging to selected category
                    ////console.log(player.playerCategory + "< -- >" + this.category.category);
                    //let handicapLimits:any = this.category.handicapLimits;
                    ////console.log(player.playerCategory + " -- " + this.selectedCategory.category);
                    if (player.playerCategory !== this.selectedCategoryValue) {
                        continue;
                    }

                    if (this.selectedCategory.handicapLimits != null) {
                        // Skip this player if not in the selected handicap range

                        let handicap: number = player.handicap;

                        // if (this.upperCategoryLimit) {
                        //     if (handicap < handicapLimits.upperLimitStart || handicap > handicapLimits.upperLimitEnd) {
                        //         continue;
                        //     }
                        // } else {
                        //     if (handicap < handicapLimits.lowerLimitStart || handicap > handicapLimits.lowerLimitEnd) {
                        //         continue;
                        //     }
                        // }
                    }
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

                if (scores.length <= 0) continue;

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

                    let underGross: number = objScore.getGrossUnder();
                    grossUnderTotal += underGross;
                    //netUnderTotal = netUnderTotal + objScore.getNetUnder(handicapAllocation);
                    let underNet = objScore.getNetUnder(handicapAllocation);
                    stableFordPointsTotal +=
                        objScore.getStablefordPoints(handicapAllocation);
                    handicap += objScore.getPlayerHandicap(handicapAllocation);
                    scoreHandicap =
                        objScore.getPlayerHandicap(handicapAllocation);
                    holesPlayed++;

                    if (!flightIds.includes(score.flightId)) {
                        flightIds.push(score.flightId);
                    }

                    scores[cntr]['underGross'] = underGross;
                    scores[cntr]['underNet'] = underNet;
                    cntr++;

                    //if(player.id == "-L6192uVBlBFw3grUy9_")
                    ////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.HoleIPQL.holeNo);
                }

                maxHolesPlayed =
                    maxHolesPlayed < holesPlayed ? holesPlayed : maxHolesPlayed;

                let playerHole18ScoreUnder: any[] = [];
                let playerHole18ScoreUnderNet: any[] = [];
                let playerHole18ScoreGross: any[] = [];
                let playerHole18ScoreNet: any[] = [];

                for (let i = 0; i < 18; i++) {
                    let hole = scores.find((a) => {
                        return a.HoleIPQL.holeNo == i + 1;
                    });
                    ////console.log(hole);

                    if (hole) {
                        playerHole18ScoreGross[i] = hole.grossScore;
                        playerHole18ScoreNet[i] = hole.netScore;

                        playerHole18ScoreUnder[i] = hole.underGross;
                        playerHole18ScoreUnderNet[i] = hole.underNet;
                    } else {
                        playerHole18ScoreGross[i] = 0;
                        playerHole18ScoreNet[i] = 0;
                        //playerHole18ScoreUnder[i] = 100; for per hole calculation if player not palyed
                        //playerHole18ScoreUnderNet[i] = 100; for per hole calculation
                        playerHole18ScoreUnder[i] = 0;
                        playerHole18ScoreUnderNet[i] = 0;
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
                let status: any = this.memberStatusesQLs.find(
                    (s) => s.playerId === playerId
                );

                let extraData: string = player.extraData;
                let completed: boolean =
                    holesPlayed > 0 &&
                    holesPlayed >= this.noOfHolesInCourse * flightIds.length;
                let teamName: string = flightData.FlightName
                    ? flightData.FlightName.name
                    : 'UNKNOWN TEAM';

                let LeaderGross: any = {
                    playerId: playerId,
                    name: name,
                    teamName: teamName,
                    score: grossTotal,
                    status: status ? 1 : 0,
                    extraData: extraData,
                    under: grossUnderTotal,
                    holes: maxHolesPlayed,
                    completed: completed,
                    holeScores: playerHole18ScoreGross,
                    holeUnders: playerHole18ScoreUnder,
                };

                flightGrossLeaders.push(LeaderGross);
                this.grossAllLeaders.push(LeaderGross);

                let LeaderNet: any = {
                    playerId: playerId,
                    name: name,
                    teamName: teamName,
                    handicap: handicap,
                    score: netTotal,
                    type: LeaderType.NET,
                    status: status ? 1 : 0,
                    extraData: extraData,
                    under: netUnderTotal,
                    holes: maxHolesPlayed,
                    completed: completed,
                    holeScores: playerHole18ScoreNet,
                    holeUnders: playerHole18ScoreUnderNet,
                };

                flightNetLeaders.push(LeaderNet);
                this.netAllLeaders.push(LeaderNet);

                // if(flag)
                //   this.calculateTotal(LeaderGross, LeaderNet, round);
            } // members iteration ended

            // this.sortLeadersTie(flightGrossLeaders);
            // var size = 3;
            // var items = flightGrossLeaders.slice(0, size).map(i => {
            //     return i;
            // });

            // let associativeScore = 0;
            // let associativeUnderScore = 0;
            // let associativeHolesPlayed = 0;
            // let associativeCompleted = false;

            // for(let leader of items)
            // {
            //   associativeScore += leader.score;
            //   associativeUnderScore += leader.under;
            //   associativeHolesPlayed = leader.holes;
            //   associativeCompleted = leader.completed;
            // }
            ////console.log(flightGrossLeaders);
            ////console.log(flightNetLeaders);

            let threeBall: any[] = [];

            if (this.matchFormat == matchFormat.BEST_THREE)
                threeBall = this.getThreeBallDetail(flightGrossLeaders, 3);
            else if (this.matchFormat == matchFormat.COMBINE_ALL)
                threeBall = this.getCombineAllDetail(flightGrossLeaders, 3);
            else {
            }

            ////console.log(threeBall);

            var itemsGross = flightGrossLeaders.slice(0, 3).map((i) => {
                return i;
            });

            var removedGrossScore = flightGrossLeaders.filter(
                (n) => !itemsGross.some((n2) => n.playerId == n2.playerId)
            );

            ////console.log(removedGrossScore);

            let name: string = flightData.FlightName
                ? flightData.FlightName.name
                : 'UNKNOWN TEAM';

            let unique_name = name.replace(/\s/g, '').toLowerCase();

            let LeaderGross: any = {
                position: 0,
                tied: false,
                courseId: flightData.courseId,
                holeSets: flightData.courseHoleSets,
                playerId: unique_name,
                name: name,
                picture: '',
                handicap: 0,
                score: threeBall['associativeScore'],
                type: LeaderType.GROSS,
                status: status ? 1 : 0,
                extraData: '',
                under: threeBall['associativeUnderScore'],
                points: '',
                holes: threeBall['associativeHolesPlayed'],
                completed: threeBall['associativeCompleted'],
                holeScores: flightGrossLeaders,
                removedScore: threeBall['ignoreScores'],
                // holeScoreLast18: this.getLastHolesTotal(18, playerHole18ScoreGross),
                // holeScoreLast9: this.getLastHolesTotal(9, playerHole18ScoreGross),
                // holeScoreLast6: this.getLastHolesTotal(6, playerHole18ScoreGross),
                // holeScoreLast3: this.getLastHolesTotal(3, playerHole18ScoreGross),
                // holeScoreLast1: this.getLastHolesTotal(1, playerHole18ScoreGross)
            };

            ////console.log(LeaderGross);
            ////console.log(LeaderGross.holeScores.length);

            if (LeaderGross.holeScores.length > 0)
                this.grossLeaders.push(LeaderGross);

            let threeBallNet = this.getThreeBallDetail(flightNetLeaders, 3);

            var itemsNet = flightNetLeaders.slice(0, 3).map((i) => {
                return i;
            });

            //var removedNetScore = flightNetLeaders.filter(n => !itemsNet.some(n2 => n.playerId == n2.playerId));

            let LeaderNet: any = {
                position: 0,
                tied: false,
                courseId: flightData.courseId,
                holeSets: flightData.courseHoleSets,
                playerId: unique_name,
                name: name,
                picture: '',
                handicap: 0,
                score: threeBallNet['associativeScore'],
                type: LeaderType.NET,
                status: status ? 1 : 0,
                extraData: '',
                under: threeBallNet['associativeUnderScore'],
                points: '',
                holes: threeBallNet['associativeHolesPlayed'],
                completed: threeBallNet['associativeCompleted'],
                holeScores: flightNetLeaders,
                removedScore: threeBallNet['ignoreScores'],
                // holeScoreLast18: this.getLastHolesTotal(18, playerHole18ScoreGross),
                // holeScoreLast9: this.getLastHolesTotal(9, playerHole18ScoreGross),
                // holeScoreLast6: this.getLastHolesTotal(6, playerHole18ScoreGross),
                // holeScoreLast3: this.getLastHolesTotal(3, playerHole18ScoreGross),
                // holeScoreLast1: this.getLastHolesTotal(1, playerHole18ScoreGross)
            };

            this.netLeaders.push(LeaderNet);
            //this.netAllLeaders.push(LeaderNet);

            if (flag && LeaderGross.holeScores.length > 0)
                this.calculateTotal(LeaderGross, LeaderNet, round);
        }
        //this.sortLeaders(this.grossLeaders);

        this.sortLeadersTie(this.grossLeaders);
        this.sortLeadersTie(this.netLeaders);
        ////console.log(this.grossLeaders);
        ////console.log(this.netLeaders);
        //this.sortLeaders(this.netLeaders);

        //return { gross: this.grossLeaders, net: this.netLeaders };
    }

    getThreeBallDetail(flightLeaders: any, size: number) {
        ////console.log(flightLeaders);
        //this.sortLeadersTie(flightLeaders);
        flightLeaders = flightLeaders.sort(this.ComparatorScore);

        var items = flightLeaders.slice(0, size).map((i) => {
            return i;
        });

        ////console.log(items);

        var removedNetScore = flightLeaders.filter(
            (n) => !items.some((n2) => n.playerId == n2.playerId)
        );

        ////console.log(removedNetScore);

        let threeBallData: any[] = [];
        let playerScores: any[] = [];
        threeBallData['associativeScore'] = 0;
        threeBallData['associativeUnderScore'] = 0;
        threeBallData['associativeHolesPlayed'] = 0;
        threeBallData['associativeCompleted'] = false;

        for (let leader of items) {
            threeBallData['associativeScore'] += leader.score;

            if (leader.score != 0)
                threeBallData['associativeUnderScore'] += leader.under;

            threeBallData['associativeHolesPlayed'] = leader.holes;
            threeBallData['associativeCompleted'] = leader.completed;
            playerScores.push(leader.holeScores);
        }

        threeBallData['holeScores'] = playerScores;
        threeBallData['ignoreScores'] = removedNetScore;

        ////console.log(threeBallData);

        return threeBallData;
    }

    getThreeBallPerHole(flightLeaders: any, size: number) {
        ////console.log(flightLeaders);
        ////console.log(flightLeaders.length);

        let threeBallData: any[] = [];
        let playerScores: any[] = [];

        threeBallData['associativeScore'] = 0;
        threeBallData['associativeUnderScore'] = 0;
        threeBallData['associativeHolesPlayed'] = 0;
        threeBallData['associativeCompleted'] = false;

        let scorePerHole: any[][] = [];
        let scoreHoleKey: any[][] = [];
        let scoreUnderPerHole: any[][] = [];
        let holesPlayedPerUser: number = 0;
        let ignoreScores: any[] = [];

        for (let i = 0; i < 18; i++) {
            let cnt = 0;
            let scorePlayedHole: number = 0;
            let teamUnderScore: number = 0;
            scorePerHole[i] = [];
            scoreHoleKey[i] = [];
            scoreUnderPerHole[i] = [];

            for (let p in flightLeaders) {
                scorePerHole[i][cnt] = flightLeaders[p].holeScores[i];

                scoreUnderPerHole[i][cnt] = flightLeaders[p].holeUnders[i];
                scoreHoleKey[i][flightLeaders[p].playerId] =
                    flightLeaders[p].holeScores[i];
                cnt++;
            }

            ////console.log(scoreHoleKey[i]);
            scoreHoleKey[i] = Object.keys(scoreHoleKey[i]).sort(function (
                a,
                b
            ) {
                return scoreHoleKey[i][a] - scoreHoleKey[i][b];
            });
            ////console.log(scoreHoleKey[i]);
            scorePerHole[i] = scorePerHole[i].sort(this.sortNumber);
            ////console.log(scorePerHole[i]);

            scorePerHole[i] = this.pushZerosToEnd(
                scorePerHole[i],
                scorePerHole[i].length
            );
            ////console.log(scorePerHole[i]);

            var bestThree = scorePerHole[i].slice(0, size).map((i) => {
                return i;
            });

            scoreUnderPerHole[i] = scoreUnderPerHole[i].sort(this.sortNumber);
            ////console.log(scoreUnderPerHole[i]);
            //scoreUnderPerHole[i] = this.pushZerosToEnd(scoreUnderPerHole[i], scoreUnderPerHole[i].length);

            ////console.log(scoreUnderPerHole[i].reduce((a, b) => a + b));

            var bestThreeUnder = scoreUnderPerHole[i]
                .slice(0, size)
                .map((i) => {
                    return i;
                });

            ////console.log(bestThreeUnder);
            ////console.log(bestThreeUnder.reduce((a, b) => a + b));

            // const result = roles.filter(role => role.groups.find(group => user.groups.includes(group.id)));
            // //console.log(result);

            ////console.log(bestThree);

            let playedCount = 0;
            let scoreCount = 0;
            for (let b of bestThree) {
                if (b != 0) {
                    scoreCount += b;
                    playedCount++;
                }
            }

            if (playedCount >= 3) {
                scorePlayedHole = scoreCount;
                holesPlayedPerUser++;
                ////console.log(bestThreeUnder.reduce((a, b) => a + b));

                for (let u of bestThreeUnder) {
                    if (u != 100) teamUnderScore += u;
                }

                if (scoreHoleKey[i].length >= 3)
                    ignoreScores[i] = scoreHoleKey[i][3];
                else ignoreScores[i] = '';
            } else {
                ignoreScores[i] = '';
            }

            ////console.log(i + "<>" +  holesPlayedPerUser);

            ////console.log(scorePlayedHole);
            threeBallData['associativeScore'] += scorePlayedHole;
            threeBallData['associativeUnderScore'] += teamUnderScore; // scoreUnderPerHole[i].reduce((a, b) => a + b);
            threeBallData['associativeHolesPlayed'] = holesPlayedPerUser;
            threeBallData['associativeCompleted'] =
                holesPlayedPerUser >= 18 ? true : false;
            threeBallData['ignoreScores'] = ignoreScores;
        }

        return threeBallData;
    }

    sortNumber(a, b) {
        return a - b;
    }

    getCombineAllDetail(flightLeaders: any, size: number) {
        ////console.log(flightLeaders);
        ////console.log(flightLeaders.length);

        this.sortLeadersTie(flightLeaders);

        var items = flightLeaders.slice(0, size).map((i) => {
            return i;
        });

        let threeBallData: any[] = [];
        let playerScores: any[] = [];
        threeBallData['associativeScore'] = 0;
        threeBallData['associativeUnderScore'] = 0;
        threeBallData['associativeHolesPlayed'] = 0;
        threeBallData['associativeCompleted'] = false;

        for (let leader of items) {
            threeBallData['associativeScore'] += leader.score;
            threeBallData['associativeUnderScore'] += leader.under;
            threeBallData['associativeHolesPlayed'] = leader.holes;
            threeBallData['associativeCompleted'] = leader.completed;
            playerScores.push(leader.holeScores);
        }
        threeBallData['holeScores'] = playerScores;

        return threeBallData;
    }

    getPreviousSelection() {
        if (this.flightRound == 0) {
            if (this.lastActiveTab == 1) {
                this.isGross = false;
                this.isNet = false;
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else if (this.lastActiveTab == 2) {
                this.isNet = false;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = true;
                this.allRoundCutOffNet = true;
            } else {
                this.isGross = false;
                this.isNet = false;
                this.allRoundGrossScore = true;
                this.allRoundCutOff = true;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            }

            this.grossLeaders = [];
            this.netLeaders = [];
            this.grossAllLeaders = [];
            this.netAllLeaders = [];
            this.allMatchResults = [];

            this.parseSubscriptionResponse(this.Leaderboard);
        } else {
            if (this.lastActiveTab == 1) {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else if (this.lastActiveTab == 2) {
                this.isNet = true;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            } else {
                this.isGross = true;
                this.isNet = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
            }

            this.grossLeaders = [];
            this.netLeaders = [];
            this.grossAllLeaders = [];
            this.netAllLeaders = [];

            if (this.Leaderboard.noOfRounds > 1) {
                //this.createSimpleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false);
                //(this.matchFormat == matchFormat.TEXAS_SCRAMBLE)? this.createTexasScrampleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false) : this.createSimpleLeaders(this.roundFlights[this.flightRound - 1], this.flightRound, false);
                if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                    this.createTexasScrampleLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.BEST_THREE &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.COMBINE_ALL &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
                else
                    this.createSimpleLeaders(
                        this.roundFlights[this.flightRound - 1],
                        this.flightRound,
                        false
                    );
            } else {
                //this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);
                //(this.matchFormat == matchFormat.TEXAS_SCRAMBLE)? this.createTexasScrampleLeaders(this.Leaderboard.FlightsQL, 1, false) : this.createSimpleLeaders(this.Leaderboard.FlightsQL, 1, false);
                if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE)
                    this.createTexasScrampleLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.BEST_THREE &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else if (
                    this.matchFormat == matchFormat.COMBINE_ALL &&
                    this.teamMatch
                )
                    this.createBestThreeLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
                else
                    this.createSimpleLeaders(
                        this.Leaderboard.FlightsQL,
                        1,
                        false
                    );
            }
        }
    }

    changeTournament(item) {
        if (item.value && item.value != 0)
            window.open(
                'https://app.gemgolfers.com/leaderboard/' + item.value,
                '_top'
            );

        this.selectedSubTournament = '0';
    }

    // Function which pushes all zeros to end of an array.
    pushZerosToEnd(arr: number[], n: number) {
        let count: number = 0; // Count of non-zero elements

        // Traverse the array. If element encountered is non-
        // zero, then replace the element at index 'count'
        // with this element
        for (let i = 0; i < n; i++) if (arr[i] != 0) arr[count++] = arr[i]; // here count is
        // incremented

        // Now all non-zero elements have been shifted to
        // front and  'count' is set as index of first 0.
        // Make all elements 0 from count to end.
        while (count < n) arr[count++] = 0;

        return arr;
    }

    isPlayerCategoryToSkip(
        playerCategory: string,
        playerHandicap: number
    ): boolean {
        ////console.log("this.selectedCategoryValue-> " + this.selectedCategoryValue);
        if (this.selectedCategoryValue == null) {
            return false;
        }

        let categoryName: string = this.selectedCategoryValue;

        if (
            categoryName.toLowerCase() !== 'all' &&
            playerCategory !== categoryName
        ) {
            return true;
        }
        ////console.log("handicaplimits");
        if (this.selectedCategory.handicapLimits == null) {
            return false;
        }

        if (this.categoryLimit == 2) {
            return (
                playerHandicap <
                    this.selectedCategory.handicapLimits.upperLimitStart ||
                playerHandicap >
                    this.selectedCategory.handicapLimits.upperLimitEnd
            );
        } else if (
            this.categoryLimit == 1 &&
            this.hasMiddleLimits(this.selectedCategory)
        ) {
            return (
                playerHandicap <
                    this.selectedCategory.handicapLimits.middleLimitStart ||
                playerHandicap >
                    this.selectedCategory.handicapLimits.middleLimitEnd
            );
        } else {
            return (
                playerHandicap <
                    this.selectedCategory.handicapLimits.lowerLimitStart ||
                playerHandicap >
                    this.selectedCategory.handicapLimits.lowerLimitEnd
            );
        }
    }

    hasLimits(categoryData): boolean {
        if (!categoryData.handicapLimits) return false;

        return (
            categoryData.handicapLimits.lowerLimitStart >= 0 &&
            categoryData.handicapLimits.lowerLimitEnd >
                categoryData.handicapLimits.lowerLimitStart &&
            categoryData.handicapLimits.upperLimitStart >
                categoryData.handicapLimits.lowerLimitEnd &&
            categoryData.handicapLimits.upperLimitEnd >
                categoryData.handicapLimits.upperLimitStart
        );
    }

    hasMiddleLimits(categoryData): boolean {
        if (!categoryData.handicapLimits) return false;
        return (
            categoryData.handicapLimits.middleLimitStart >= 0 &&
            categoryData.handicapLimits.middleLimitEnd >
                categoryData.handicapLimits.middleLimitStart
        );
    }

    updateCategoryNames() {
        let categoryNames: string[] = [];
        this.eventCategories = [];
        this.Leaderboard.CategoriesQL.sort(this.sortCategory);
        for (let c of this.Leaderboard.CategoriesQL) {
            categoryNames.push(this.getTitle(c, 0));
            if (this.hasLimits(c)) {
                if (this.hasMiddleLimits(c)) {
                    categoryNames.push(this.getTitle(c, 1));
                }
                categoryNames.push(this.getTitle(c, 2));
            }
        }
        return categoryNames;
    }

    getTitle(
        categoryData: any,
        limit: number /* 0: lower, 1: middle, 2: upper */
    ): string {
        let title: string = categoryData.category;
        if (this.hasLimits(categoryData)) {
            if (limit == 2) {
                title +=
                    ' (' +
                    categoryData.handicapLimits.upperLimitStart +
                    ' - ' +
                    categoryData.handicapLimits.upperLimitEnd +
                    ')';

                let eventCat: any = {
                    Text: title,
                    Value: categoryData.category + '#2',
                };

                this.eventCategories.push(eventCat);
            } else if (limit == 1 && this.hasMiddleLimits(categoryData)) {
                title +=
                    ' (' +
                    categoryData.handicapLimits.middleLimitStart +
                    ' - ' +
                    categoryData.handicapLimits.middleLimitEnd +
                    ')';

                let eventCat: any = {
                    Text: title,
                    Value: categoryData.category + '#1',
                    Limit: true,
                };

                this.eventCategories.push(eventCat);
            } else {
                title +=
                    ' (' +
                    categoryData.handicapLimits.lowerLimitStart +
                    ' - ' +
                    categoryData.handicapLimits.lowerLimitEnd +
                    ')';

                let eventCat: any = {
                    Text: title,
                    Value: categoryData.category + '#0',
                    Limit: true,
                };

                this.eventCategories.push(eventCat);
            }
        } else {
            let eventCat: any = {
                Text: title,
                Value: categoryData.category,
                Limit: false,
            };

            this.eventCategories.push(eventCat);
        }

        return title;
    }
}
