// Import necessary modules and components
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPlayerScoreComponent } from '../../dialogs/dialog-player-score/dialog-player-score.component';
import { handicapAllocation } from 'app/shared/classes/general';
import { Player } from 'app/shared/models/player.model';
import { Score } from 'app/shared/classes/score';
import { LeaderTypeValue } from 'app/shared/classes/leader';




@Component({
    selector: 'app-stroke-play', // This is the selector for the component
    templateUrl: './strokePlay.component.html', // HTML template file path
    styleUrls: ['./strokePlay.component.scss'] // CSS/SCSS styles file(s) path
})
export class StrokePlayComponent implements OnInit, OnChanges {
    @Input() data: any;
    Leaderboard: any;
    LeaderboardAllPlayers: any[] = [];
    LeaderboardPlayers: any[] = [];
    allLeadersCutOffGross: any[] = [];
    allLeadersCutOffNet: any[] = [];
    selectedCategory: any;
    selectedIndex: any = 0;
    flightRound: any = 0;
    activeRound: any = 1;
    totalRounds: any = 1;
    lastActiveTab: any = 1;
    cuttOffScore: number = 0;

    showBestBall: boolean = false;
    isCuttOffRequired: boolean = false;
    allRoundGrossScore: boolean = true;
    allRoundNetScore: boolean;
    allRoundCutOff: boolean = false;
    searchName: boolean = false;
    allRoundCutOffNet: boolean = false;

    isGross: boolean = false;
    isNet: boolean = false;

    selectedCategoryValue: string = '';
    eventCategories: string[] = [];
    tRounds: any[] = [];
    categoryLimit: number;
    constructor(
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        console.log(this.data);
        this.Leaderboard = this.data.TournamentQL[0];
        this.activeRound = this.Leaderboard.activeRound
        this.totalRounds = this.Leaderboard.noOfRounds
        this.LeaderboardAllPlayers = this.data.LeaderBoardQL;

        if (!this.selectedCategoryValue) {
            this.updateCategoryNames();
        }
        let count = 0;
        if (this.Leaderboard.CategoriesQL.length > 0) {
            if (!this.selectedCategoryValue) {
                this.selectedCategory =
                    this.Leaderboard.CategoriesQL.find((a) => {
                        this.selectedIndex = count;
                        count++;

                        return a.default == true;
                    });
                this.selectedCategoryValue =
                    this.selectedCategory.category;
            }
            console.log(this.selectedCategoryValue);

        }
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
        this.getPlayers(this.LeaderboardAllPlayers, 0, 1)

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
                this.LeaderboardPlayers = leaders.filter(obj => {
                    return obj.category === this.selectedCategoryValue
                })
                console.log(this.LeaderboardPlayers);
                if (this.Leaderboard.cutOffCriteria !== null) {
                    this.cutLeaders(this.Leaderboard.cutOffCriteria, this.LeaderboardPlayers)
                }
                if (this.allLeadersCutOffGross.length > 0) {
                    this.isCuttOffRequired = true;
                    this.allRoundCutOff = true;
                    this.sortAllGrossLeadersTie(this.allLeadersCutOffGross)
                }
                if (this.allLeadersCutOffNet.length > 0) {
                    this.isCuttOffRequired = true;
                    this.allRoundCutOffNet = true;
                    this.sortAllNetLeadersTie(this.allLeadersCutOffNet)
                }
                if (lastTab == 1) {
                    this.LeaderboardPlayers.sort(this.ComparatorAllGross);
                    this.sortAllGrossLeadersTie(this.LeaderboardPlayers)
                } else {
                    this.LeaderboardPlayers.sort(this.ComparatorAllNet);
                    this.sortAllNetLeadersTie(this.LeaderboardPlayers)
                }
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
        if (lastTab == 1) {
            this.LeaderboardPlayers.sort((a, b) => {
                return this.ComparatorScoreG(a, b, this.flightRound);
            });
            this.sortLeadersGross(this.LeaderboardPlayers, round);
        } else {
            this.LeaderboardPlayers.sort((a, b) => {
                return this.ComparatorScoreN(a, b, this.flightRound);
            });
            this.sortLeadersNet(this.LeaderboardPlayers, round);
        }
    }
    getScoreByRoundG(item: any, round: number): string {
        const propertyName = `scoreR${round}`;
        return item[propertyName] || ''; // Return the scoreR1 or scoreR2 property if it exists, or an empty string if it doesn't
    }
    getUnderByRoundG(item: any, round: number): string {
        const propertyName = `underGross${round}`;
        return item[propertyName] || ''; // Return the scoreR1 or scoreR2 property if it exists, or an empty string if it doesn't
    }
    getHolesByRoundG(item: any, round: number): string {
        const propertyName = `holesPlayedR${round}`;
        return item[propertyName] || ''; // Return the scoreR1 or scoreR2 property if it exists, or an empty string if it doesn't
    }
    getScoreByRoundN(item: any, round: number): string {
        const propertyName = `netScoreR${round}`;
        return item[propertyName] || ''; // Return the scoreR1 or scoreR2 property if it exists, or an empty string if it doesn't
    }
    getUnderByRoundN(item: any, round: number): string {
        const propertyName = `underNet${round}`;
        return item[propertyName] || ''; // Return the scoreR1 or scoreR2 property if it exists, or an empty string if it doesn't
    }
    getHolesByRoundN(item: any, round: number): string {
        const propertyName = `holesPlayedR${round}`;
        return item[propertyName] || ''; // Return the scoreR1 or scoreR2 property if it exists, or an empty string if it doesn't
    }
    getUnderStyleG(item: any, round: number): { [key: string]: string } {
        const underValue = parseFloat(this.getUnderByRoundG(item, round)); // Parse the value if needed
        const style = {};

        if (underValue < 0) {
            style['color'] = 'red'; // Set the 'color' property to 'red'
        }

        // Add more style properties as needed

        return style;
    }
    getUnderStyleN(item: any, round: number): { [key: string]: string } {
        const underValue = parseFloat(this.getUnderByRoundN(item, round)); // Parse the value if needed
        const style = {};

        if (underValue < 0) {
            style['color'] = 'red'; // Set the 'color' property to 'red'
        }

        // Add more style properties as needed

        return style;
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
                this.getPlayers(this.LeaderboardAllPlayers, 0, 1)

            } else if (item.value == LeaderTypeValue.NET) {
                ////console.log("Selected value: " + item.value);
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = true;
                this.allRoundCutOffNet = true;
                this.isNet = false;
                this.isGross = false;
                this.lastActiveTab = 2;
                this.getPlayers(this.LeaderboardAllPlayers, 0, 2)

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
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 1)

            } else if (item.value == LeaderTypeValue.NET) {
                ////console.log("Selected value: " + item.value);
                this.isNet = true;
                this.isGross = false;
                this.allRoundGrossScore = false;
                this.allRoundCutOff = false;

                this.allRoundNetScore = false;
                this.allRoundCutOffNet = false;
                this.lastActiveTab = 2;
                this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, 2)

            }
        }
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
    changeCategory(item) {
        console.log('TAb Changes');

        this.activeRound = this.Leaderboard.activeRound;
        let originalCategory: string = '';
        if (item.tab.textLabel.search('#') == -1) {
            originalCategory = item.tab.textLabel;
        } else {
            let splitted = item.tab.textLabel.split('#', 3);
            originalCategory = splitted[0];
            this.categoryLimit = splitted[1];
        }

        this.selectedCategory = this.Leaderboard.CategoriesQL.find(
            (c) => c.category === originalCategory
        );
        this.selectedCategoryValue = this.selectedCategory.category;
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
            this.getPlayers(this.LeaderboardAllPlayers, 0, this.lastActiveTab);
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
            this.getPlayers(this.LeaderboardAllPlayers, +this.flightRound, this.lastActiveTab);
        }
    }
    // viewPlayerScore(
    //     name: string,
    //     courseId: string,
    //     courseHoleSets: string,
    //     playerId: string,
    //     holeSetsInverted: string,
    //     scoreType: string
    // ) {
    //     let playerGrossScore: any[] = [];
    //     let playerNetScore: any[] = [];
    //     let playerPerTeam: any[];
    //     let team: boolean = false;
    //     let removed: string[] = [];
    //     let scores: any[];
    //     let scoresArray: any[] = [];
    //     //console.log(playerId);
    //     let handicapAllocation: string = this.getHandicapAllocation();
    //     if (this.showBestBall == true) {
    //         for (let flightData of this.Leaderboard.FlightsQL) {
    //             if (flightData.id == playerId) {
    //                 let membersQLs: any = flightData.MembersQL;
    //                 for (let membersQL of membersQLs) {
    //                     scores = membersQL.ScoresQL;
    //                     let player: Player = membersQL.PlayerQL;
    //                     // if (scores.length <= 0) continue;

    //                     for (let score of scores) {
    //                         let objScore: Score = new Score(
    //                             score.playerId,
    //                             score.playerHandicap,
    //                             score.hole.index,
    //                             score.hole.par,
    //                             score.grossScore
    //                         );
    //                         let gross: number = score.grossScore;
    //                         // if (gross <= 0) {
    //                         //     continue;
    //                         // }
    //                         let currentNet: number =
    //                             objScore.getNetScore(handicapAllocation);
    //                         score['netScore'] = currentNet;
    //                         score['check'] = false;
    //                         scoresArray.push(score.grossScore);
    //                     }
    //                     let playerHole18ScoreGross: any[] = [];
    //                     let playerHole18ScoreNet: any[] = [];

    //                     for (
    //                         let i = 0;
    //                         i < flightData.CourseQL.noOfHoles;
    //                         i++
    //                     ) {
    //                         let hole = scores.find((a) => {
    //                             return a.hole.holeNo == i + 1;
    //                         });

    //                         if (hole) {
    //                             playerHole18ScoreGross[i] = hole.grossScore;
    //                             playerHole18ScoreNet[i] = hole.netScore;
    //                         } else {
    //                             playerHole18ScoreGross[i] = 0;
    //                             playerHole18ScoreNet[i] = 0;
    //                         }
    //                     }
    //                     let teamName: string = flightData.name
    //                         ? flightData.name.name
    //                         : 'UNKNOWN TEAM';
    //                     let LeaderGross: any = {
    //                         name: player.firstName + ' ' + player.lastName,
    //                         holeScores: playerHole18ScoreGross,
    //                     };
    //                     let LeaderNet: any = {
    //                         name: player.firstName + ' ' + player.lastName,
    //                         holeScores: playerHole18ScoreNet,
    //                     };
    //                     playerGrossScore.push(LeaderGross);
    //                     playerNetScore.push(LeaderNet);
    //                 }
    //             }
    //         }
    //         console.log(playerGrossScore);
    //     } else if (this.flightRound == 0) {
    //         playerGrossScore = this.grossAllLeaders.filter((g) => {
    //             return g.playerId == playerId;
    //         });

    //         playerNetScore = this.netAllLeaders.filter((g) => {
    //             return g.playerId == playerId;
    //         });
    //     } else {
    //         playerGrossScore = this.grossLeaders.filter((g) => {
    //             return g.playerId == playerId;
    //         });

    //         playerNetScore = this.netLeaders.filter((g) => {
    //             return g.playerId == playerId;
    //         });
    //     }
    //     playerPerTeam = this.Leaderboard.FlightsQL.filter((a) => {
    //         return a.id == playerId;
    //     });

    //     ////console.log(playerGrossScore);
    //     if (
    //         this.teamMatch &&
    //         (this.matchFormat == matchFormat.BEST_THREE ||
    //             this.matchFormat == matchFormat.COMBINE_ALL)
    //     ) {
    //         removed =
    //             playerGrossScore.length > 0 && playerGrossScore[0].removedScore
    //                 ? playerGrossScore[0].removedScore
    //                 : [];
    //         playerGrossScore =
    //             playerGrossScore.length > 0
    //                 ? playerGrossScore[0].holeScores
    //                 : [];
    //         playerNetScore =
    //             playerNetScore.length > 0 ? playerNetScore[0].holeScores : [];

    //         if (!removed) removed = [];

    //         team = true;
    //     }
    //     if (this.matchFormat == matchFormat.TEXAS_SCRAMBLE) {
    //         const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
    //             data: {
    //                 name: name,
    //                 tee_id:
    //                     this.Leaderboard.tee_id != null
    //                         ? this.Leaderboard.tee_id
    //                         : 1,
    //                 course: courseId,
    //                 players: playerPerTeam[0]['MembersQL'],
    //                 holeSets: courseHoleSets,
    //                 courseHoleSetsInverted: holeSetsInverted,
    //                 allGross: playerGrossScore,
    //                 allNet: playerNetScore,
    //                 round: this.flightRound,
    //                 type: scoreType,
    //                 team: team,
    //                 removed: removed,
    //             },
    //         });
    //     } else if (this.matchFormat == matchFormat.BESTBALL) {
    //         const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
    //             data: {
    //                 name: name,
    //                 tee_id:
    //                     this.Leaderboard.tee_id != null
    //                         ? this.Leaderboard.tee_id
    //                         : 1,
    //                 course: courseId,
    //                 players: [],
    //                 holeSets: courseHoleSets,
    //                 courseHoleSetsInverted: holeSetsInverted,
    //                 allGross: playerGrossScore,
    //                 allNet: playerNetScore,
    //                 round: this.flightRound,
    //                 type: this.allRoundNetScore || this.isNet ? 'Net' : 'Gross',
    //                 team: team,
    //                 removed: removed,
    //             },
    //         });
    //     } else {
    //         const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
    //             data: {
    //                 name: name,
    //                 tee_id:
    //                     this.Leaderboard.tee_id != null
    //                         ? this.Leaderboard.tee_id
    //                         : 1,
    //                 course: courseId,
    //                 players: [],
    //                 holeSets: courseHoleSets,
    //                 allGross: playerGrossScore,
    //                 courseHoleSetsInverted: holeSetsInverted,
    //                 allNet: playerNetScore,
    //                 round: this.flightRound,
    //                 type: this.allRoundNetScore ? 'Net' : 'Gross',
    //                 team: team,
    //                 removed: removed,
    //             },
    //         });
    //     }
    // }
    sortCategory(a, b) {
        if (a['category'] < b['category']) {
            return -1;
        }
        if (a['category'] > b['category']) {
            return 1;
        }
        return 0;
    }
    ComparatorAllGross(a, b) {
        if (a['underGross'] < b['underGross']) return -1;
        if (a['underGross'] > b['underGross']) return 1;
        return 0;
    }
    ComparatorAllNet(a, b) {
        if (a['underNet'] < b['underNet']) return -1;
        if (a['underNet'] > b['underNet']) return 1;
        return 0;
    }
    ComparatorScoreG(a, b, flightRound) {
        // let round = +this.flightRound;
        if (a[`underGross${flightRound}`] < b[`underGross${flightRound}`]) return -1;
        if (a[`underGross${flightRound}`] > b[`underGross${flightRound}`]) return 1;
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
    private sortLeadersGross(leaderList: any[], round) {
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

            tied = leaderCurrent[`underGross${round}`] == leaderPrevious[`underGross${round}`];
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
    private sortAllGrossLeadersTie(leaderGrossList: any[]) {
        leaderGrossList = leaderGrossList.sort(this.ComparatorAllGrossPosition);
        let pos: number = 1;
        let tied: boolean;

        if (leaderGrossList.length > 0) leaderGrossList[0]['position'] = pos;

        ////console.log(leaderList);
        for (let i = 1; i < leaderGrossList.length; i++) {
            let leaderCurrent = leaderGrossList[i];
            let leaderPrevious = leaderGrossList[i - 1];
            // console.log(i);

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

            tied = leaderCurrent.underGross == leaderPrevious.underGross;

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
        console.log(leaderGrossList);

        return leaderGrossList;
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
            tied = leaderCurrent.underNet == leaderPrevious.underNet;

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
            compare = a.underNet - b.underNet;

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
