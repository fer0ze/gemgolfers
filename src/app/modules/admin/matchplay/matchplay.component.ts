import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Player } from 'app/shared/models/player.model';
import { Score } from 'app/shared/models/score.model';
import { Hole } from 'app/shared/models/hole.model';
import {
    matchFormat,
    Tournament,
    TournamentRounds,
} from 'app/shared/models/tournament.model';
import { FacadeService } from 'app/shared/services/facade.service';
import { Constants, General } from 'app/shared/classes/general';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogPlayerScoreComponent } from '../dialogs/dialog-player-score/dialog-player-score.component';
import { of } from 'rxjs';

@Component({
    selector: 'app-matchplay',
    templateUrl: './matchplay.component.html',
    styleUrls: ['./matchplay.component.scss'],
})
export class MatchplayComponent implements OnInit {
    @Input()
    tournamentID: string;
    @Input()
    courseID: string;
    myPlayer: Player;
    isLoading: Boolean = true;
    loggedInuser: Player;
    matchPlayData: any[] = [];
    totalRounds: number = 0;
    activeRound: number;
    courseHoleSetNames;
    flightRound: number;
    ddSelectedFlight: string = '0';
    tRounds: TournamentRounds[] = [];
    currentRoundFlights: any[] = [];
    roundFlights: any[] = [];
    //scoreHeader: any[] = [];
    //tournamentID: string;
    filterPlayer: string = '';
    coursesList: any[] = [];
    selectedCourse: string = '';
    courseHoleSet: number = 0;
    subTournaments: any[];
    showTaxes: boolean = false;
    active: boolean = false;
    flightPlayers: any[] = [];
    filters: FormGroup;
    contactList: FormArray;
    selectedTeamName: boolean = false;
    showRound1: boolean = false;
    showRound2: boolean = false;
    showRound3: boolean = false;
    showRound4: boolean = false;
    selectedIndex: any = 0;
    noOfRounds: any = 0;
    constructor(
        private router: Router,
        private location: Router,
        private route: ActivatedRoute,
        private apollo: Apollo,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private facadeService: FacadeService
    ) {}

    ngOnInit() {
        this.filters = this._formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
        });

        this.route.paramMap.subscribe((params) => {
            //this.tournamentID = params.get("id");
        });

        of(this.matchPlayData)
            .pipe()
            .subscribe(
                async (data) => {
                    let dataLeaderboard =
                        await this.facadeService.MatchPlayDataQuery(
                            '-L6WPki8tSDZ1IAAoRXZ',
                            this.tournamentID
                        );
                    let selectedCourseHoleSet =
                        await this.facadeService.getCourseHoleSetsForCourse(
                            this.courseID
                        );
                    this.courseHoleSetNames =
                        selectedCourseHoleSet['course_hole_sets'];
                    this.matchPlayData = dataLeaderboard.TournamentQL;
                    this.isLoading = false;
                    //console.log('Match play data');
                    console.log(this.matchPlayData);
                    if (
                        this.matchPlayData['matchFormat'] ==
                        matchFormat.TEXAS_SCRAMBLE
                    ) {
                        this.showTaxes = true;
                    }

                    let tournamentData: any = this.matchPlayData;

                    this.activeRound = tournamentData.activeRound;
                    this.totalRounds = tournamentData.noOfRounds;
                    this.selectedIndex = this.activeRound - 1;

                    this.noOfRounds = tournamentData.noOfRounds;
                    if (this.activeRound > this.noOfRounds) {
                        if (this.noOfRounds == 1) this.showRound1 = true;
                        else if (this.noOfRounds == 2) this.showRound2 = true;
                        else if (this.noOfRounds == 3) this.showRound3 = true;
                        else if (this.noOfRounds == 4) this.showRound4 = true;
                        else this.showRound4 = true;
                    } else {
                        if (this.activeRound == 1) this.showRound1 = true;
                        else if (this.activeRound == 2) this.showRound2 = true;
                        else if (this.activeRound == 3) this.showRound3 = true;
                        else if (this.activeRound == 4) this.showRound4 = true;
                        else this.showRound4 = true;
                    }

                    this.subTournaments = tournamentData.SubTournamentsQL;

                    if (tournamentData.activeRound > tournamentData.noOfRounds)
                        this.flightRound = tournamentData.noOfRounds;
                    else this.flightRound = tournamentData.activeRound;

                    // for (
                    //     let round = 1;
                    //     round <= tournamentData.noOfRounds;
                    //     round++
                    // ) {
                    //     let r: any = {
                    //         Text: 'Round ' + round,
                    //         Value: round,
                    //     };
                    //     this.tRounds.push(r);
                    // }

                    this.parseSubscriptionResponse();
                },
                (error) => (this.isLoading = false)
            );
    }

    changeFlight(item) {
        //console.log("Selected value: " + item.value);
        this.ddSelectedFlight = item.value;

        this.roundFlights = [];
        //this.scoreHeader = [];

        this.flightPlayers = [];
        //this.currentRoundFlights = [];

        this.parseSubscriptionResponse();
    }

    changeCourse(item) {
        console.log('Selected value: ' + item.value);
        this.selectedCourse = item.value;

        this.roundFlights = [];
        //this.scoreHeader = [];

        this.flightPlayers = [];
        //this.currentRoundFlights = [];

        this.parseSubscriptionResponse();
    }

    filterPlayerFlight(flag: boolean) {
        if (flag) {
            this.filterPlayer = this.filters.get('name').value;
        } else {
            this.filterPlayer = '';
            this.filters.reset();
        }
        //this.ddSelectedFlight = this.filterPlayer;
        this.selectedTeamName = true;
        this.roundFlights = [];
        //this.scoreHeader = [];

        this.flightPlayers = [];
        this.parseSubscriptionResponse();
    }

    changeRound(item) {
        //console.log("Selected value: " + item.value);
        if (this.active) {
            this.flightRound = item.index + 1;
            if (this.flightRound == 1) this.showRound1 = true;
            else if (this.flightRound == 2) this.showRound2 = true;
            else if (this.flightRound == 3) this.showRound3 = true;
            else if (this.flightRound == 4) this.showRound4 = true;

            this.ddSelectedFlight = '0';
            this.roundFlights = [];
            //this.scoreHeader = [];

            this.flightPlayers = [];
            //this.currentRoundFlights = [];

            this.parseSubscriptionResponse();
        }
    }

    private parseSubscriptionResponse(): boolean {
        if (this.matchPlayData == null) {
            return false;
        }

        let tournamentData: any = this.matchPlayData;

        if (tournamentData.noOfRounds > 0) {
            if (this.ddSelectedFlight != '0') {
                this.roundFlights = tournamentData.FlightsQL.filter((a) => {
                    return (
                        a.flightRound == this.flightRound &&
                        a.id == this.ddSelectedFlight
                    );
                });
            } else {
                this.roundFlights = tournamentData.FlightsQL.filter((a) => {
                    return a.flightRound == this.flightRound;
                });

                if (this.selectedCourse != '') {
                    this.roundFlights = this.roundFlights.filter((a) => {
                        return a.courseId == this.selectedCourse;
                    });
                }

                this.currentRoundFlights = [];
                for (let flight of this.roundFlights) {
                    //console.log(flight);
                    if (!this.showTaxes) {
                        let r: any = {
                            Text: 'Flight ' + flight.flightNo,
                            Value: flight.id,
                        };
                        this.currentRoundFlights.push(r);
                    } else {
                        let r: any = {
                            Text: 'Team ' + flight.flightNo,
                            Value: flight.id,
                        };
                        this.currentRoundFlights.push(r);
                    }
                }
                //console.log(this.currentRoundFlights);
            }
            //console.log(this.roundFlights);
            console.log(this.filterPlayer);
            if (!this.showTaxes && this.filterPlayer != '') {
                var filteredArray: any = this.roundFlights
                    .filter((element) =>
                        element.MembersQL.some(
                            (MembersQL) =>
                                MembersQL.PlayerQL.firstName
                                    .toLowerCase()
                                    .includes(
                                        this.filterPlayer.toLowerCase()
                                    ) ||
                                MembersQL.PlayerQL.lastName
                                    .toLowerCase()
                                    .includes(this.filterPlayer.toLowerCase())
                        )
                    )
                    .map((element) => {
                        let n = Object.assign({}, element, {
                            MembersQL: element.MembersQL.filter(
                                (subElement) =>
                                    subElement.PlayerQL.firstName
                                        .toLowerCase()
                                        .includes(
                                            this.filterPlayer.toLowerCase()
                                        ) ||
                                    subElement.PlayerQL.lastName
                                        .toLowerCase()
                                        .includes(
                                            this.filterPlayer.toLowerCase()
                                        )
                            ),
                        });
                        return n;
                    });

                // let filteredArray = this.roundFlights
                // .filter((element) =>
                //   element.MembersQL.some((subElement) => subElement.PlayerQL.firstName === this.filterPlayer))
                // .map(element => {
                //   let newElt = Object.assign({}, element); // copies element
                //   return newElt.MembersQL.filter(subElement => subElement.PlayerQL.firstName === this.filterPlayer);
                // });

                //console.log(filteredArray);
            } else if (this.filterPlayer != '') {
                if (!this.selectedTeamName) {
                    var filteredArray: any = this.roundFlights;
                } else {
                    var filteredArray: any = this.roundFlights.filter(
                        (element) => {
                            if (
                                element.FlightName.name
                                    .toLowerCase()
                                    .includes(this.filterPlayer.toLowerCase())
                            ) {
                                return element;
                            } else {
                                return '';
                            }
                        }
                    );
                }

                // .filter((element) =>
                //   element.FlightName.some(
                //     (member) =>
                //     member.name
                //         .toLowerCase()
                //         .includes(this.filterPlayer.toLowerCase()) ||
                //         member.name
                //         .toLowerCase().includes(this.filterPlayer.toLowerCase())
                //   )
                // )
                // .map((element) => {
                //   let n = Object.assign({}, element, {
                //     MembersQL: element.MembersQL.filter(
                //       (subElement) =>
                //         subElement.PlayerQL.firstName
                //           .toLowerCase()
                //           .includes(this.filterPlayer.toLowerCase()) ||
                //         subElement.PlayerQL.lastName
                //           .toLowerCase()
                //           .includes(this.filterPlayer.toLowerCase())
                //     ),
                //   });
                //   return n;
                // });
            }

            //console.log(this.roundFlights);
            if (filteredArray) {
                this.setupMatchplayData(filteredArray, 2, true);
            } else if (this.roundFlights.length > 0) {
                //console.log("not null");
                this.setupMatchplayData(this.roundFlights, 2, true);
            }
        }
    }
    private async setupMatchplayData(
        flightsQLs: any[],
        round: number,
        flag: boolean
    ) {
        let findex = 0;
        for (let flightData of flightsQLs) {
            //console.log(flightData);
            //console.log("Flight ID: " + flightData.id);
            let membersQLs: any = flightData.MembersQL;
            let singleFlight: any[] = [];
            let courseHoleSetTitle;
            let flightHeader = await this.setupMatchplayHeader(
                this.matchPlayData['CourseQL'],
                flightData.courseHoleSets !== 0 ? flightData.courseHoleSets : 3,
                flightData.courseHoleSetsInverted
            );

            //console.log(par9);
            //console.log(par18);
            //console.log(flightData);
            if (!this.showTaxes) {
                for (let membersQL of membersQLs) {
                    let player: Player = membersQL.PlayerQL;
                    let playerScore: any[] = membersQL.ScoresQL;

                    let playerId: String = player.id;

                    if (player == null) {
                        continue;
                    }

                    let playerHole9Score: any = [];
                    let playerHole18Score: any[] = [];
                    let gross9Total = 0;
                    let gross18Total = 0;
                    let holePlayed: number = 0;

                    for (let i = 0; i < 9; i++) {
                        let courseHole = flightHeader.courseHoles9.filter(
                            (el) => {
                                return el.holeNo == i + 1;
                            }
                        );

                        // console.log(courseHole);

                        let hole = playerScore.find((a) => {
                            return (
                                a.holeId ==
                                (courseHole.length > 0 ? courseHole[0].id : '')
                            );
                        });
                        // console.log(hole);

                        if (hole) {
                            playerHole9Score[i] = hole.grossScore;
                            gross9Total += hole.grossScore;
                            holePlayed++;
                        } else playerHole9Score[i] = '';
                    }

                    for (let i = 0; i < 9; i++) {
                        if (flightHeader.courseHoles18.length > 0) {
                            let courseHole = flightHeader.courseHoles18.filter(
                                (el) => {
                                    return el.holeNo == i + 9 + 1;
                                }
                            );

                            // console.log(i + 9 + 1);
                            // console.log(courseHole);

                            let hole = playerScore.find((a) => {
                                // console.log(a.holeId + "<---->" + courseHole[0].id);
                                // console.log(courseHole.length > 0 ? courseHole[0].id : "");
                                return (
                                    a.holeId ==
                                    (courseHole.length > 0
                                        ? courseHole[0].id
                                        : '')
                                );
                            });

                            //console.log(hole);

                            if (hole) {
                                playerHole18Score[i] = hole.grossScore;
                                gross18Total += hole.grossScore;
                                holePlayed++;
                            } else playerHole18Score[i] = '';
                        }
                    }

                    let grossTotal: number = gross9Total + gross18Total;

                    //console.log(playerHole9Score);
                    //console.log(playerHole18Score);

                    if (this.courseHoleSetNames) {
                        courseHoleSetTitle = this.courseHoleSetNames.find(
                            (a) => {
                                return (
                                    a.holeSets == flightData.courseHoleSets &&
                                    a.inverted ==
                                        flightData.courseHoleSetsInverted
                                );
                            }
                        );
                    }
                    let LeaderGross: any = {
                        flightId: flightData.id,
                        courseId: this.matchPlayData['CourseQL'].id,
                        playerId: player.id,
                        name: player.firstName + ' ' + player.lastName,
                        picture: player.picture,
                        handicap: player.handicap,
                        Hole9Scores: playerHole9Score,
                        Hole18Scores: playerHole18Score,
                        gross9Total: gross9Total,
                        gross18Total: gross18Total,
                        grossTotal: grossTotal,
                        holesPlayed: holePlayed,
                    };

                    singleFlight.push(LeaderGross);
                }
            } else {
                for (let membersQL of membersQLs) {
                    let player: Player = membersQL.PlayerQL;

                    let playerScore: any[] = membersQL.ScoresQL;

                    let playerId: String = player.id;

                    if (player == null) {
                        continue;
                    }

                    let playerHole9Score: any = [];
                    let playerHole18Score: any[] = [];
                    let gross9Total = 0;
                    let gross18Total = 0;
                    let holePlayed: number = 0;

                    for (let i = 0; i < 9; i++) {
                        let courseHole = flightHeader.courseHoles9.filter(
                            (el) => {
                                return el.holeNo == i + 1;
                            }
                        );

                        //console.log(courseHole);

                        let hole = playerScore.find((a) => {
                            return (
                                a.holeId ==
                                (courseHole.length > 0 ? courseHole[0].id : '')
                            );
                        });
                        //console.log(hole);

                        if (hole) {
                            playerHole9Score[i] = hole.grossScore;
                            gross9Total += hole.grossScore;
                            holePlayed++;
                        } else playerHole9Score[i] = '';
                    }

                    for (let i = 0; i < 9; i++) {
                        let courseHole = flightHeader.courseHoles18.filter(
                            (el) => {
                                return el.holeNo == i + 9 + 1;
                            }
                        );

                        // console.log(i + 9 + 1);
                        // console.log(courseHole);

                        let hole = playerScore.find((a) => {
                            console.log(a.holeId + '<---->' + courseHole[0].id);
                            console.log(
                                courseHole.length > 0 ? courseHole[0].id : ''
                            );
                            return (
                                a.holeId ==
                                (courseHole.length > 0 ? courseHole[0].id : '')
                            );
                        });

                        //console.log(hole);

                        if (hole) {
                            playerHole18Score[i] = hole.grossScore;
                            gross18Total += hole.grossScore;
                            holePlayed++;
                        } else playerHole18Score[i] = '';
                    }

                    let grossTotal: number = gross9Total + gross18Total;

                    //console.log(playerHole9Score);
                    //console.log(playerHole18Score);

                    if (this.courseHoleSetNames) {
                        courseHoleSetTitle = this.courseHoleSetNames.find(
                            (a) => {
                                return (
                                    a.holeSets == flightData.courseHoleSets &&
                                    a.inverted ==
                                        flightData.courseHoleSetsInverted
                                );
                            }
                        );
                    }

                    let LeaderGross: any = {
                        teamName: flightData['FlightName'].name,
                        flightId: this.matchPlayData['CourseQL'].id,
                        courseId: flightData.courseId,
                        playerId: player.id,
                        name: player.firstName + ' ' + player.lastName,
                        picture: player.picture,
                        handicap: player.handicap,
                        Hole9Scores: playerHole9Score,
                        Hole18Scores: playerHole18Score,
                        gross9Total: gross9Total,
                        gross18Total: gross18Total,
                        grossTotal: grossTotal,
                        holesPlayed: holePlayed,
                    };

                    singleFlight.push(LeaderGross);
                }
            }

            this.flightPlayers.push(singleFlight);
            this.flightPlayers[findex]['header'] = flightHeader;
            (this.flightPlayers[findex]['FlightName'] = this.showTaxes
                ? flightData['FlightName'].name
                : ''),
                (this.flightPlayers[findex]['flightId'] = flightData.id);
            this.flightPlayers[findex]['courseHoleSetTitle'] =
                courseHoleSetTitle ? courseHoleSetTitle.displayName : '';
            this.flightPlayers[findex]['courseHoleSetKey'] = courseHoleSetTitle
                ? flightData.courseHoleSets +
                  '_' +
                  flightData.courseHoleSetsInverted
                : '';
            this.flightPlayers[findex]['courseTee'] = courseHoleSetTitle
                ? flightData.tee
                : '';
            this.flightPlayers[findex]['Hole9Scores'] =
                this.flightPlayers[findex][0].Hole9Scores;
            this.flightPlayers[findex]['Hole18Scores'] =
                this.flightPlayers[findex][0].Hole18Scores;
            this.flightPlayers[findex]['gross9Total'] =
                this.flightPlayers[findex][0].gross9Total;
            this.flightPlayers[findex]['gross18Total'] =
                this.flightPlayers[findex][0].gross18Total;
            this.flightPlayers[findex]['grossTotal'] =
                this.flightPlayers[findex][0].grossTotal;
            console.log(this.flightPlayers);

            findex++;
        }
        console.log(this.flightPlayers);
        this.active = true;
    }
    private async setupMatchplayHeader(
        course: any,
        holeSets: number,
        courseHoleSetsInverted: boolean
    ) {
        // let dataLeaderboard = await this.facadeService.getCourseInformation(
        //     courseId
        // );
        this.isLoading = false;
        if (course.length <= 0) return;

        let flightHeader: any[] = [];
        this.isLoading = false;
        this.courseHoleSet = holeSets;

        //if(this.courseHoleSet == 3) this.courseHoleSet = 12;

        let courseHoles9: Hole[] = [];
        let courseHoles18: Hole[] = [];
        let courseHoles27: Hole[] = [];
        let courseHoles36: Hole[] = [];

        let yardage9: number[] = [];
        let yardage18: number[] = [];
        let yardage27: number[] = [];
        let yardage36: number[] = [];

        let yardage9Total: number = 0;
        let yardage18Total: number = 0;
        let yardage27Total: number = 0;
        let yardage36Total: number = 0;

        let par9: number = 0;
        let par18: number = 0;
        let par27: number = 0;
        let par36: number = 0;

        let courseQLs: any = course;
        let holesQLs: any = course.HolesQL;

        var isPresent = this.coursesList.some(function (el) {
            return el.id === course.id;
        });

        if (!isPresent) {
            let courseInfo: any = {
                id: course.id,
                name: course.name,
            };
            this.coursesList.push(courseInfo);
        }

        //console.log(this.coursesList);

        holesQLs = holesQLs.sort(this.Comparator);

        //this.removeExtraHoleSets(holeSets, holesQLs, courseHoleSetsInverted);
        //console.log(holesQLs);
        // let courseID: any = this.matchPlayData['courseId'];

        // this.courseHoleSetNames = selectedCourseHoleSet['course_hole_sets'];
        holesQLs = this.getHolesSets(
            holeSets,
            holesQLs,
            courseHoleSetsInverted,
            this.courseHoleSetNames
        );
        for (let holeQL of holesQLs) {
            //let teeDistance = JSON.parse(holeQL.teeDistances);
            let teeDistance = holeQL.teeDistances;

            if (holeQL.holeNo < 10) {
                yardage9Total += parseInt(teeDistance.blue);
                par9 += holeQL.par;
                yardage9.push(parseInt(teeDistance.blue));

                courseHoles9.push(holeQL);
            } else if (holeQL.holeNo > 9 && holeQL.holeNo < 19) {
                yardage18.push(parseInt(teeDistance.blue));
                yardage18Total += parseInt(teeDistance.blue);
                par18 += holeQL.par;

                courseHoles18.push(holeQL);
            } else {
            }
        }

        let parTotal: number =
            Number(par9) + Number(par18) + Number(par27) + Number(par36);
        let yardageTotal: number =
            Number(yardage9Total) +
            Number(yardage18Total) +
            Number(yardage27Total) +
            Number(yardage36Total);

        let scoreHeader: any = {
            courseHoles9: courseHoles9,
            courseHoles18: courseHoles18,
            courseHoles27: courseHoles27,
            courseHoles36: courseHoles36,
            yardage9: yardage9,
            yardage18: yardage18,
            yardage27: yardage27,
            yardage36: yardage36,
            yardage9Total: yardage9Total,
            yardage18Total: yardage18Total,
            yardage27Total: yardage27Total,
            yardage36Total: yardage36Total,
            par9: par9,
            par18: par18,
            par27: par27,
            par36: par36,
            parTotal: parTotal,
            yardageTotal: yardageTotal,
        };
        //console.log(scoreHeader);
        flightHeader.push(scoreHeader);
        return scoreHeader;
        //console.log(this.scoreHeader);
    }

    public getHolesSets(
        courseHoleSets: number,
        holes,
        isCourseHoleSetsInverted: boolean,
        holesSets
    ) {
        let arrayOfHoleSet: any = [];
        if (courseHoleSets == 0) {
            return;
        }
        for (let obj of holesSets) {
            if (
                obj.holeSets == courseHoleSets &&
                isCourseHoleSetsInverted == obj.inverted
            ) {
                if (obj.backId == null) {
                    let counter = 1;
                    for (let i of holes) {
                        if (obj.id == i.holeSetId) {
                            let singleHole: any = {
                                id: i.id,
                                courseId: i.courseId,
                                holeNo: counter,
                                par: i.par,
                                index: i.index,
                                teeDistances: i.teeDistances,
                                holeSetId: i.holeSetId,
                            };
                            arrayOfHoleSet.push(singleHole);
                            counter++;
                        }
                    }
                } else {
                    let holesSetA = holesSets.find(
                        (x) => x.holeSets == obj.frontId
                    );
                    let holesSetB = holesSets.find(
                        (x) => x.holeSets == obj.backId
                    );
                    // console.log(holesSetA);
                    // console.log(holesSetB);
                    let counter = 1;
                    for (let i of holes) {
                        if (holesSetA.id == i.holeSetId) {
                            let singleHole: any = {
                                id: i.id,
                                courseId: i.courseId,
                                holeNo: counter,
                                par: i.par,
                                index: i.index,
                                teeDistances: i.teeDistances,
                                holeSetId: i.holeSetId,
                            };
                            arrayOfHoleSet.push(singleHole);
                            counter++;
                        }
                    }
                    let counterA = 10;
                    for (let i of holes) {
                        if (holesSetB.id == i.holeSetId) {
                            let singleHole: any = {
                                id: i.id,
                                courseId: i.courseId,
                                holeNo: counterA,
                                par: i.par,
                                index: i.index,
                                teeDistances: i.teeDistances,
                                holeSetId: i.holeSetId,
                            };
                            arrayOfHoleSet.push(singleHole);
                            counterA++;
                        }
                    }
                }
            }
        }
        return arrayOfHoleSet;
    }

    viewPlayerScore(flight: any) {
        console.log(flight);

        let player: any[] = flight.filter((a) => a);
        console.log(player);

        const dialogRef = this.dialog.open(DialogPlayerScoreComponent, {
            data: {
                flight: player,
            },
        });
    }

    async saveFlightScore(flightId: string) {
        //var startingHole1 = parseFloat((<HTMLInputElement>document.getElementById("hole_1_-L613n4gp3nF0QiXiCt1")).value);
        //console.log(flightId);
        let selectedFlight: any = this.flightPlayers.find((a) => {
            return a.flightId == flightId;
        });

        console.log(selectedFlight);

        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        //let tournamentData: any = this.matchPlayData;
        //let courseQLs: any = tournamentData.CourseQL;
        //let holesQLs: any = courseQLs.HolesQL;
        let playerScores: Score[] = [];

        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        let courseQLs = null;
        let courseHoleQLs = null;
        if (selectedFlight.length > 0)
            courseQLs = await this.facadeService.getCourseInformation(
                selectedFlight[0].courseId
            );

        if (courseQLs && courseQLs.course && courseQLs.course.length > 0)
            courseHoleQLs = courseQLs.course[0].HolesQL;

        let allSubTournamentMember = this.getSubTournamentPlayers();

        if (!this.showTaxes)
            for (let player of selectedFlight) {
                let totalPlayed = 0;
                let playerScoresIds: string[] = [];
                let playerEmptyScoresIds: string[] = [];
                let player1DigitIds: string[] = [];
                let player2DigitIds: string[] = [];

                for (let hole of courseHoleQLs) {
                    //console.log(hole.id);
                    let holeObj = <HTMLInputElement>(
                        document.getElementById(hole.id + '&' + player.playerId)
                    );
                    if (holeObj) {
                        let grossScore = parseFloat(
                            (<HTMLInputElement>(
                                document.getElementById(
                                    hole.id + '&' + player.playerId
                                )
                            )).value
                        );

                        console.log(grossScore);
                        if (grossScore) {
                            let playerScore: Score = {
                                playerId: player.playerId,
                                flightId: player.flightId,
                                holeId: hole.id,
                                playerHandicap: this.precisionRound(
                                    player.handicap,
                                    0
                                ),
                                grossScore: grossScore,
                                updatedAt: General.parseToDate(
                                    todayDate.toDateString()
                                ),
                                updaterId: this.loggedInuser.id,
                                updaterName:
                                    this.loggedInuser.firstName +
                                    ' ' +
                                    this.loggedInuser.lastName,
                                detailId: null,
                            };
                            console.log(playerScore);

                            playerScores.push(playerScore);

                            let subTournamentMember =
                                allSubTournamentMember.filter(
                                    (x) => x.playerId == player.playerId
                                );

                            if (subTournamentMember.length > 0) {
                                for (let subScore of subTournamentMember) {
                                    let subFlightScore = Object.assign(
                                        {},
                                        playerScore
                                    );
                                    subFlightScore.flightId = subScore.flightId;
                                    console.log(
                                        subFlightScore.flightId +
                                            ' ### ' +
                                            playerScore.flightId
                                    );
                                    playerScores.push(subFlightScore);
                                }
                            }

                            playerScoresIds.push(
                                hole.id + '&' + player.playerId
                            );

                            if (grossScore > 9)
                                player2DigitIds.push(
                                    hole.id + '&' + player.playerId
                                );
                            else
                                player1DigitIds.push(
                                    hole.id + '&' + player.playerId
                                );

                            totalPlayed++;
                        } else
                            playerEmptyScoresIds.push(
                                hole.id + '&' + player.playerId
                            );
                    }
                }
                console.log(playerScores);
                console.log(playerScoresIds);
                console.log(playerEmptyScoresIds);

                if (totalPlayed > 0) {
                    if (playerEmptyScoresIds.length > 0) {
                        for (let id of playerEmptyScoresIds) {
                            var element = document.getElementById(id)
                                .parentNode as HTMLElement;
                            element.classList.add('empty');
                        }
                    }
                    if (playerScoresIds.length > 0) {
                        for (let id of playerScoresIds) {
                            var a = document.getElementById(id)
                                .parentNode as HTMLElement;
                            a.classList.remove('empty');
                        }
                    }
                    if (player2DigitIds.length > 0) {
                        for (let id of player2DigitIds) {
                            var a = document.getElementById(id)
                                .parentNode as HTMLElement;
                            a.classList.add('warn');
                        }
                    }
                    if (player1DigitIds.length > 0) {
                        for (let id of player1DigitIds) {
                            document
                                .getElementById(id)
                                .classList.remove('warn');
                        }
                    }
                }
            }
        else {
            for (let player of selectedFlight) {
                let totalPlayed = 0;
                let playerScoresIds: string[] = [];
                let playerEmptyScoresIds: string[] = [];
                let player1DigitIds: string[] = [];
                let player2DigitIds: string[] = [];

                for (let hole of courseHoleQLs) {
                    //console.log(hole.id);
                    let holeObj = <HTMLInputElement>(
                        document.getElementById(hole.id + '&' + flightId)
                    );
                    if (holeObj) {
                        let grossScore = parseFloat(
                            (<HTMLInputElement>(
                                document.getElementById(
                                    hole.id + '&' + flightId
                                )
                            )).value
                        );

                        console.log(grossScore);
                        if (grossScore) {
                            let playerScore: Score = {
                                playerId: player.playerId,
                                flightId: player.flightId,
                                holeId: hole.id,
                                playerHandicap: this.precisionRound(
                                    player.handicap,
                                    0
                                ),
                                grossScore: grossScore,
                                updatedAt: General.parseToDate(
                                    todayDate.toDateString()
                                ),
                                updaterId: this.loggedInuser.id,
                                updaterName:
                                    this.loggedInuser.firstName +
                                    ' ' +
                                    this.loggedInuser.lastName,
                                detailId: null,
                            };
                            console.log(playerScore);

                            playerScores.push(playerScore);

                            let subTournamentMember =
                                allSubTournamentMember.filter(
                                    (x) => x.playerId == player.playerId
                                );

                            if (subTournamentMember.length > 0) {
                                for (let subScore of subTournamentMember) {
                                    let subFlightScore = Object.assign(
                                        {},
                                        playerScore
                                    );
                                    subFlightScore.flightId = subScore.flightId;
                                    console.log(
                                        subFlightScore.flightId +
                                            ' ### ' +
                                            playerScore.flightId
                                    );
                                    playerScores.push(subFlightScore);
                                }
                            }

                            playerScoresIds.push(hole.id + '&' + flightId);

                            if (grossScore > 9)
                                player2DigitIds.push(hole.id + '&' + flightId);
                            else player1DigitIds.push(hole.id + '&' + flightId);

                            totalPlayed++;
                        } else
                            playerEmptyScoresIds.push(hole.id + '&' + flightId);
                    }
                }
                console.log(playerScores);
                console.log(playerScoresIds);
                console.log(playerEmptyScoresIds);

                if (totalPlayed > 0) {
                    if (playerEmptyScoresIds.length > 0) {
                        for (let id of playerEmptyScoresIds) {
                            var element = document.getElementById(id)
                                .parentNode as HTMLElement;
                            element.classList.add('empty');
                        }
                    }
                    if (playerScoresIds.length > 0) {
                        for (let id of playerScoresIds) {
                            var a = document.getElementById(id)
                                .parentNode as HTMLElement;
                            a.classList.remove('empty');
                        }
                    }
                    if (player2DigitIds.length > 0) {
                        for (let id of player2DigitIds) {
                            var a = document.getElementById(id)
                                .parentNode as HTMLElement;
                            a.classList.add('warn');
                        }
                    }
                    if (player1DigitIds.length > 0) {
                        for (let id of player1DigitIds) {
                            document
                                .getElementById(id)
                                .classList.remove('warn');
                        }
                    }
                }
            }
        }

        let result = <any>(
            await this.facadeService.SaveScoresMutation(playerScores)
        );

        if (result) {
            this.snackBar.open('Score has been submitted.', 'x', {
                duration: 5000,
            });

            let todayString: Date = new Date();
            let timeupdated: any = await this.facadeService.setScoreUpdateTime(
                this.tournamentID,
                todayString.toLocaleDateString() +
                    'T' +
                    todayString.toLocaleTimeString()
            );

            if (timeupdated) return;
        }
    }

    async savePlayerScore(flightId: string, playerId: string) {
        //var startingHole1 = parseFloat((<HTMLInputElement>document.getElementById("hole_1_-L613n4gp3nF0QiXiCt1")).value);
        //console.log(this.flightPlayers);

        let selectedFlight: any = this.flightPlayers.find((a) => {
            return a.flightId == flightId;
        });

        //console.log(selectedFlight);
        //return false;

        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        //let tournamentData: any = this.matchPlayData;
        //let courseQLs: any = tournamentData.CourseQL;
        //let holesQLs: any = courseQLs.HolesQL;
        let playerScores: Score[] = [];

        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        let courseQLs = null;
        let courseHoleQLs = null;
        if (selectedFlight.length > 0)
            courseQLs = await this.facadeService.getCourseInformation(
                selectedFlight[0].courseId
            );

        if (courseQLs && courseQLs.course && courseQLs.course.length > 0)
            courseHoleQLs = courseQLs.course[0].HolesQL;

        let allSubTournamentMember = this.getSubTournamentPlayers();

        for (let player of selectedFlight) {
            //console.log(player.playerId);

            if (player.playerId == playerId) {
                for (let hole of courseHoleQLs) {
                    let holeObj = <HTMLInputElement>(
                        document.getElementById(hole.id + '&' + player.playerId)
                    );
                    console.log(holeObj);
                    if (holeObj) {
                        let grossScore = holeObj
                            ? parseFloat(
                                  (<HTMLInputElement>(
                                      document.getElementById(
                                          hole.id + '&' + player.playerId
                                      )
                                  )).value
                              )
                            : 0;

                        if (!grossScore) {
                            var element = document.getElementById(
                                hole.id + '&' + player.playerId
                            ).parentNode as HTMLElement;
                            element.classList.add('empty');
                        } else {
                            var element = document.getElementById(
                                hole.id + '&' + player.playerId
                            ).parentNode as HTMLElement;
                            element.classList.remove('empty');
                        }

                        if (grossScore && grossScore > 9) {
                            var element = document.getElementById(
                                hole.id + '&' + player.playerId
                            ).parentNode as HTMLElement;
                            element.classList.add('warn');
                        } else {
                            var element = document.getElementById(
                                hole.id + '&' + player.playerId
                            ).parentNode as HTMLElement;
                            element.classList.remove('warn');
                        }

                        //console.log(grossScore);
                        if (grossScore) {
                            let playerScore: Score = {
                                playerId: player.playerId,
                                flightId: player.flightId,
                                holeId: hole.id,
                                playerHandicap: this.precisionRound(
                                    player.handicap,
                                    0
                                ),
                                grossScore: grossScore,
                                updatedAt: General.parseToDate(
                                    todayDate.toDateString()
                                ),
                                updaterId: this.loggedInuser.id,
                                updaterName:
                                    this.loggedInuser.firstName +
                                    ' ' +
                                    this.loggedInuser.lastName,
                                detailId: null,
                            };
                            playerScores.push(playerScore);

                            let subTournamentMember =
                                allSubTournamentMember.filter(
                                    (x) => x.playerId == player.playerId
                                );

                            if (subTournamentMember.length > 0) {
                                for (let subScore of subTournamentMember) {
                                    let subFlightScore = Object.assign(
                                        {},
                                        playerScore
                                    );
                                    subFlightScore.flightId = subScore.flightId;
                                    console.log(
                                        subFlightScore.flightId +
                                            ' ### ' +
                                            playerScore.flightId
                                    );
                                    playerScores.push(subFlightScore);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(playerScores);
        //console.log(playerScores.length);

        let result: any;

        if (playerScores.length > 0) {
            result = <any>(
                await this.facadeService.SaveScoresMutation(playerScores)
            );
        }

        if (result) {
            this.snackBar.open('Score has been submitted.', 'x', {
                duration: 5000,
            });

            let todayString: Date = new Date();
            let timeupdated: any = await this.facadeService.setScoreUpdateTime(
                this.tournamentID,
                todayString.toLocaleDateString() +
                    'T' +
                    todayString.toLocaleTimeString()
            );

            if (timeupdated) return;
        }
    }

    getSubTournamentPlayers() {
        let subTournamentsFlightMembers: any = [];
        if (this.subTournaments.length > 0) {
            let currentflightRound: number = this.flightRound;
            for (let subTournamentsQL of this.subTournaments) {
                let subTournamentFlightsQLs =
                    subTournamentsQL.SubTournamentQL.SubTournamentFlightsQL;
                for (let subTournamentFlightsQL of subTournamentFlightsQLs) {
                    if (
                        currentflightRound == subTournamentFlightsQL.flightRound
                    ) {
                        var flightId: string = subTournamentFlightsQL.id;
                        var playerIds: string[] = [];
                        var subTournamentMembersQLs =
                            subTournamentFlightsQL.SubTournamentMembersQL;
                        for (let subTournamentMembersQL of subTournamentMembersQLs) {
                            var playerId = subTournamentMembersQL.playerId;
                            console.log(playerId);
                            let flightPlayer: any = {
                                flightId: flightId,
                                playerId: playerId,
                            };
                            //playerIds.push(flightPlayer);
                            subTournamentsFlightMembers.push(flightPlayer);
                        }
                        //subTournamentsFlightMembers.push(playerIds);
                    }
                }
            }
        }

        return subTournamentsFlightMembers;
    }

    onGross9Change(grossValue: string, playerId: string, header: any): void {
        let total9: number = 0;

        for (let hole of header.courseHoles9) {
            if (
                <HTMLInputElement>(
                    document.getElementById(hole.id + '&' + playerId)
                )
            )
                total9 +=
                    (<HTMLInputElement>(
                        document.getElementById(hole.id + '&' + playerId)
                    )).value != ''
                        ? parseFloat(
                              (<HTMLInputElement>(
                                  document.getElementById(
                                      hole.id + '&' + playerId
                                  )
                              )).value
                          )
                        : 0;
        }

        // var hole1 = parseFloat((<HTMLInputElement>document.getElementById("hole_1_" + playerId)).value);
        // var hole2 = parseFloat((<HTMLInputElement>document.getElementById("hole_2_" + playerId)).value);
        // var hole3 = parseFloat((<HTMLInputElement>document.getElementById("hole_3_" + playerId)).value);
        // var hole4 = parseFloat((<HTMLInputElement>document.getElementById("hole_4_" + playerId)).value);
        // var hole5 = parseFloat((<HTMLInputElement>document.getElementById("hole_5_" + playerId)).value);
        // var hole6 = parseFloat((<HTMLInputElement>document.getElementById("hole_6_" + playerId)).value);
        // var hole7 = parseFloat((<HTMLInputElement>document.getElementById("hole_7_" + playerId)).value);
        // var hole8 = parseFloat((<HTMLInputElement>document.getElementById("hole_8_" + playerId)).value);
        // var hole9 = parseFloat((<HTMLInputElement>document.getElementById("hole_9_" + playerId)).value);
        var gross9total = <HTMLInputElement>(
            document.getElementById('gross9total_' + playerId)
        );
        var gross18total = <HTMLInputElement>(
            document.getElementById('gross18total_' + playerId)
        );
        var grosstotal = <HTMLInputElement>(
            document.getElementById('grosstotal_' + playerId)
        );

        //let total9 = ((Number(hole1))? Number(hole1) : 0) + ((Number(hole2))? Number(hole2) : 0) + ((Number(hole3))? Number(hole3) : 0) + ((Number(hole4))? Number(hole4) : 0) + ((Number(hole5))? Number(hole5) : 0) + ((Number(hole6))? Number(hole6) : 0) + ((Number(hole7))? Number(hole7) : 0) + ((Number(hole8))? Number(hole8) : 0) + ((Number(hole9))? Number(hole9) : 0);
        gross9total.value = total9.toString();

        let total: number =
            (Number(gross9total.value) ? Number(gross9total.value) : 0) +
            (Number(gross18total.value) ? Number(gross18total.value) : 0);
        grosstotal.value = total.toString();
        console.log(total);
    }

    Comparator(a, b) {
        if (a['holeNo'] < b['holeNo']) return -1;
        if (a['holeNo'] > b['holeNo']) return 1;
        return 0;
    }
    //Collections.sort(holes, (hole1, hole2) -> hole1.getIndex() - hole2.getIndex());
    ComparatorHoles(hole1, hole2) {
        return hole1.index - hole2.index;
    }

    onGross18Change(grossValue: string, playerId: string, header: any): void {
        let total18: number = 0;

        for (let hole of header.courseHoles18) {
            if (
                <HTMLInputElement>(
                    document.getElementById(hole.id + '&' + playerId)
                )
            )
                total18 +=
                    (<HTMLInputElement>(
                        document.getElementById(hole.id + '&' + playerId)
                    )).value != ''
                        ? parseFloat(
                              (<HTMLInputElement>(
                                  document.getElementById(
                                      hole.id + '&' + playerId
                                  )
                              )).value
                          )
                        : 0;
        }
        // var hole1 = parseFloat((<HTMLInputElement>document.getElementById("hole_10_" + playerId)).value);
        // var hole2 = parseFloat((<HTMLInputElement>document.getElementById("hole_11_" + playerId)).value);
        // var hole3 = parseFloat((<HTMLInputElement>document.getElementById("hole_12_" + playerId)).value);
        // var hole4 = parseFloat((<HTMLInputElement>document.getElementById("hole_13_" + playerId)).value);
        // var hole5 = parseFloat((<HTMLInputElement>document.getElementById("hole_14_" + playerId)).value);
        // var hole6 = parseFloat((<HTMLInputElement>document.getElementById("hole_15_" + playerId)).value);
        // var hole7 = parseFloat((<HTMLInputElement>document.getElementById("hole_16_" + playerId)).value);
        // var hole8 = parseFloat((<HTMLInputElement>document.getElementById("hole_17_" + playerId)).value);
        // var hole9 = parseFloat((<HTMLInputElement>document.getElementById("hole_18_" + playerId)).value);
        var gross9total = <HTMLInputElement>(
            document.getElementById('gross9total_' + playerId)
        );
        var gross18total = <HTMLInputElement>(
            document.getElementById('gross18total_' + playerId)
        );
        var grosstotal = <HTMLInputElement>(
            document.getElementById('grosstotal_' + playerId)
        );

        //let total18 = ((Number(hole1))? Number(hole1) : 0) + ((Number(hole2))? Number(hole2) : 0) + ((Number(hole3))? Number(hole3) : 0) + ((Number(hole4))? Number(hole4) : 0) + ((Number(hole5))? Number(hole5) : 0) + ((Number(hole6))? Number(hole6) : 0) + ((Number(hole7))? Number(hole7) : 0) + ((Number(hole8))? Number(hole8) : 0) + ((Number(hole9))? Number(hole9) : 0);
        gross18total.value = total18.toString();

        let total: number =
            (Number(gross9total.value) ? Number(gross9total.value) : 0) +
            (Number(gross18total.value) ? Number(gross18total.value) : 0);
        grosstotal.value = total.toString();
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    redirectToScores() {
        this.router.navigate(['/matchplay/' + this.tournamentID]);
    }

    redirectToflightManagement() {
        this.router.navigate(['/tournaments/manage/' + this.tournamentID]);
    }
    redirectToDetail() {
        this.router.navigate(['/tournaments/view/' + this.tournamentID]);
    }

    redirectToAttendance() {
        this.router.navigate(['/tournaments/attendance/' + this.tournamentID]);
    }

    redirectToLeaderboard() {
        //this.router.navigate(['/leaderboard/' + this.tournamentID]);

        let url = this.router.createUrlTree([
            '/leaderboard',
            this.matchPlayData['prefix'],
        ]);
        window.open(url.toString(), '_blank');
    }

    precisionRound(number: number, precision: number) {
        if (precision < 0) {
            let factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        } else
            return +(
                Math.round(Number(number + 'e+' + precision)) +
                'e-' +
                precision
            );
    }

    public hasHoleSet1to9(courseHoleSets): boolean {
        console.log(Constants.Holes1to9);
        return (
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes1to9) != 0
        );
    }

    public hasHoleSet10to18(courseHoleSets): boolean {
        console.log(Constants.Holes10to18);
        return (
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes10to18) != 0
        );
    }

    public hasHoleSet19to27(courseHoleSets): boolean {
        console.log(Constants.Holes19to27);
        return (
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes19to27) != 0
        );
    }

    public hasHoleSet28to36(courseHoleSets): boolean {
        console.log(Constants.Holes28to36);
        return (
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes28to36) != 0
        );
    }
}
