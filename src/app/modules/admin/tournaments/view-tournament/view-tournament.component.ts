import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    enumPlayerCategory,
    Player,
    PlayerHanidcap,
    TournamentMemberStatus,
} from '../../../../shared/models/player.model';
import { Flight, FlightMembers } from '../../../../shared/models/flight.model';
import {
    matchFormat,
    TournamentCategory,
    TournamentMember,
} from '../../../../shared/models/tournament.model';
import { Leader, LeaderType } from '../../../../shared/classes/leader';
import {
    UniqueIdGenerator,
    General,
    Constants,
    handicapAllocation,
} from '../../../../shared/classes/general';
import { FacadeService } from '../../../../shared/services/facade.service';
import { AppStats } from '../../../../shared/helper/app-stats.help';
import { FlightScores } from '../../../../shared/classes/FlightScores';
import { ScoreStats } from '../../../../shared/classes/ScoreStats';
import { of } from 'rxjs';
import { Score } from 'app/shared/classes/score';
import { AnyARecord } from 'dns';
import { DatePipe } from '@angular/common';

import { DialogCloseRoundComponent } from '../../dialogs/dialog-close-round/dialog-close-round.component';
import { DialogCourseDetailsComponent } from '../../dialogs/dialog-course-details/dialog-course-details.component';
import { DialogOverviewComponent } from '../../dialogs/dialog-overview/dialog-overview.component';
import { DialogPlayingCategoryComponent } from '../../dialogs/dialog-playing-category/dialog-playing-category.component';
import { DialogMarshalComponent } from '../../dialogs/dialog-marshal/dialog-marshal.component';
import { ApexOptions } from 'ng-apexcharts';
import { DialogPlayerListComponent } from '../../dialogs/dialog-player-list/dialog-player-list.component';
import { MatDrawer } from '@angular/material/sidenav';
import { FlightManagementComponent } from '../flight-management/flight-management.component';
import { PlayerManagementComponent } from '../player-management/player-management.component';
import { forEach } from 'lodash';
import { DialogPlayerComponent } from '../../dialogs/dialog-player/dialog-player.component';
import { DialogAddPlayerComponent } from '../../dialogs/dialog-add-player/dialog-add-player.component';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';

@Component({
    selector: 'app-view-tournament',
    templateUrl: './view-tournament.component.html',
    styleUrls: ['./view-tournament.component.scss'],
})
export class ViewTournamentComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    private tournamentID: string;
    private newFlightID: string;
    private flightRound: string;
    playersCatgery: any;
    dataSource: MatTableDataSource<any>;
    dataSourceFlightMembers: MatTableDataSource<any>;
    allMatchResults: any[] = [];
    membersColumns = [
        'firstName',
        'lastName',
        'handicap',
        'playerCategory',
        'select',
    ];
    flightsmembersColumns = [
        'firstName',
        'lastName',
        'handicap',
        'playerCategory',
        'select',
    ];
    private noOfHolesInCourse: number = 18;
    fullTournament: any;
    memberStatusesQLs: TournamentMemberStatus[] = [];
    isLoading: boolean = true;
    totalRounds: number;
    activeRound: number = 1;
    noOfRounds: number = 1;
    selected: number = 0;
    changer: number = 0;
    totalMembers: number = 0;
    webLogo: string;
    flightid: any;
    flight: any = [];
    membersData: Player[] = [];
    allPlayers: Player[] = [];
    membersStats: any[] = [];
    topMembers: any[] = [];
    topMembers1: any[] = [];
    topMembers2: any[] = [];
    topMembers3: any[] = [];
    topMembers4: any[] = [];
    leaderboardUrl: string;
    public barChartLabels: string[] = [];
    _series: any = [];
    loggedInUser: Player;
    leaderboardData: any[] = [];
    playerCategoryList: any[] = [];
    membersStatus: any;
    gridColumns = 3;
    courseImg: string;
    tournamentPlayersAdd: boolean = true;
    showCloseBtn: boolean = true;
    showMatchPlay: boolean = false;
    categories: TournamentCategory[] = [];
    FlightsQL: any[] = [];
    selectedMembers: Player[][] = [];
    activeTournamentMembers: TournamentMember[] = [];
    runningFlights: number = 0;
    teetime: number = 0;
    flightNumber: number = 0;
    scoreAdded: boolean = false;
    avgScore: number[] = [];
    avgScore1: number[] = [];
    avgScore2: number[] = [];
    avgScore3: number[] = [];
    avgScore4: number[] = [];
    chartavgScore: number[] = [];
    chartavgScore1: number[] = [];
    chartavgScore2: number[] = [];
    chartavgScore3: number[] = [];
    chartavgScore4: number[] = [];
    selectedCategory: any;
    clubLogo: any;
    par3Avg1: number;
    par4Avg1: number;
    par5Avg1: number;
    shotsBirdiesPercent1: number;
    shotsBogeysPercent1: number;
    shotsThreeOrHigherPercent1: number;
    shotsParsPercent1: number;
    shotsDoubleBogeysPercent1: number;
    roundsStats: boolean = false;
    round1Stats: boolean = false;
    round2Stats: boolean = false;
    round3Stats: boolean = false;
    round4Stats: boolean = false;
    showMainTab1: boolean = true;
    showMainTab2: boolean = false;
    showMainTab3: boolean = false;
    showMainTab4: boolean = false;
    showMainTab5: boolean = false;
    showMainTab6: boolean = false;
    showSummary: boolean = false;
    tournamentMember: any = [];
    tournamentMembers: any = [];
    dataFullTournament: any;
    cuttFlag: number = 0;
    tournamentCategories: any;
    leaderAllRoundData: any;
    AmateursCount: number = 0;
    JuniorsCount: number = 0;
    SeniorsCount: number = 0;
    VeteransCount: number = 0;
    LadiesCount: number = 0;
    AmateursPlayingDates: any[] = [];
    SeniorsPlayingDates: any[] = [];
    JuniorsPlayingDates: any[] = [];
    VeteransPlayingDates: any[] = [];
    LadiesPlayingDates: any[] = [];
    mainSelected: number = 0;
    par3Avg2: number;
    par4Avg2: number;
    par5Avg2: number;
    shotsBirdiesPercent2: number;
    shotsBogeysPercent2: number;
    shotsThreeOrHigherPercent2: number;
    shotsParsPercent2: number;
    shotsDoubleBogeysPercent2: number;
    dataSourceR1Gross: MatTableDataSource<any>;
    displayedColumnsR1Gross = ['pos', 'name', 'gross', 'toPar', 'thru'];
    dataSourceR2Gross: MatTableDataSource<any>;
    displayedColumnsR2Gross = ['pos', 'name', 'gross', 'toPar', 'thru'];
    dataSourceR3Gross: MatTableDataSource<any>;
    displayedColumnsR3Gross = ['pos', 'name', 'gross', 'toPar', 'thru'];
    dataSourceR4Gross: MatTableDataSource<any>;
    displayedColumnsR4Gross = ['pos', 'name', 'gross', 'toPar', 'thru'];
    topPlayers = [
        {
            PlayerQL: {
                firstName: 'Player',
                lastName: '1',
            },
        },
        {
            PlayerQL: {
                firstName: 'Player',
                lastName: '2',
            },
        },
        {
            PlayerQL: {
                firstName: 'Player',
                lastName: '3',
            },
        },
    ];
    dataSourceR1NET: MatTableDataSource<any>;
    displayedColumnsR1NET = ['pos', 'name', 'gross', 'toPar', 'thru'];
    dataSourceR2NET: MatTableDataSource<any>;
    displayedColumnsR2NET = ['pos', 'name', 'gross', 'toPar', 'thru'];
    dataSourceR3NET: MatTableDataSource<any>;
    displayedColumnsR3NET = ['pos', 'name', 'gross', 'toPar', 'thru'];
    dataSourceR4NET: MatTableDataSource<any>;
    displayedColumnsR4NET = ['pos', 'name', 'gross', 'toPar', 'thru'];

    dataSourceTotalGross: MatTableDataSource<any>;
    displayedColumnsTotalGross = [
        'pos',
        'name',
        'R1gross',
        'R2gross',
        'R3gross',
        'R4gross',
        'total',
    ];
    dataSourceTotalNET: MatTableDataSource<any>;
    displayedColumnsTotalNET = [
        'pos',
        'name',
        'R1net',
        'R2net',
        'R3net',
        'R4net',
        'total',
    ];

    dataSourceMembersStatus: MatTableDataSource<any>;
    displayedColumnsMembersStatus = ['name', 'category', 'handicap'];
    storagePath: string;
    chartGithubIssues: ApexOptions = {};
    // Pie
    public pieChartLabels: string[] = ['On Par 3', 'On Par 4', 'On Par 5'];
    public pieChartData1: number[] = []; //[300, 500, 100];
    public pieChartData2: number[] = [];
    public pieChartData3: number[] = [];
    public pieChartData4: number[] = [];
    public pieChartType: string = 'pie';
    public playersUpdatedHandicap: PlayerHanidcap[] = [];
    showImage: boolean = false;
    noOfROund: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    url: any;
    category: any[] = [];
    totalPlayers: any = 0;
    matchFormat: any;

    constructor(
        private datePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public changeDetection: ChangeDetectorRef,
        private _localStorage: LocalStorageService,
        private logger: LogsService,
        //private _flightManagmentComponent: FlightManagementComponent,
        public facadeService: FacadeService // private storage: AngularFireStorage
    ) {
        this.barChartLabels.push('Birdies');
        this.barChartLabels.push('Pars');
        this.barChartLabels.push('Bogeys');
        this.barChartLabels.push('D.Bogeys');
        this.barChartLabels.push('3 or Plus');
        this.barChartLabels.push('On Par 3');
        this.barChartLabels.push('On Par 4');
        this.barChartLabels.push('On Par 5');
    }

    async ngOnInit() {
        //console.log(this.route.snapshot.paramMap.get("id"));
        try {
            this.logger.log('Admin comes to View Tournament Page', "info");

            this.loggedInUser = this._localStorage.get(Constants.LOGGED_IN_USER);
            let clubInfo: any =
                this.loggedInUser.membership.length > 0
                    ? this.loggedInUser.membership[0].club
                    : null;

            this.clubLogo = clubInfo && clubInfo.logo ? clubInfo.logo : 'e2esp.png';
            this.route.paramMap.subscribe((params) => {
                this.tournamentID = params.get('id');
            });

            if (this.tournamentID) {
                this.logger.log('Getting Tournament Data', "info", this.tournamentID);
                this.url = 'golfcourse.jpg';
                this.dataFullTournament =
                    await this.facadeService.tournamentDashBoard(this.tournamentID);
                console.log(this.dataFullTournament);
                // this.getTournamentMembers();
                this.memberStatusesQLs =
                    this.dataFullTournament['TournamentQL'][0].MemberStatusesQL;
                this.noOfROund =
                    this.dataFullTournament['TournamentQL'][0].noOfRounds;

                if (
                    this.dataFullTournament['TournamentQL'][0]['CourseQL'].picture
                ) {
                } else {
                    this.url = 'golfcourse.jpg';
                }

                if (this.dataFullTournament.TournamentQL.length == 0) {
                    alert('no record found.');
                    this.isLoading = false;
                    return false;
                }
                this.matchFormat =
                    this.dataFullTournament['TournamentQL'][0]['matchFormat'];
                if (
                    this.dataFullTournament['TournamentQL'][0]['matchFormat'] ==
                    matchFormat.TEXAS_SCRAMBLE
                ) {
                    this.totalPlayers =
                        this.dataFullTournament['TournamentQL'][0][
                            'members'
                        ].length;
                    this.showCloseBtn = false;
                    this.tournamentPlayersAdd = true;
                }
                if (
                    this.dataFullTournament['TournamentQL'][0]['matchFormat'] ==
                    matchFormat.MATCH_PLAY
                ) {
                    this.showMatchPlay = true;
                }

                this.fullTournament = this.dataFullTournament.TournamentQL[0];
                this.isLoading = false;

                if (this.fullTournament) {
                    this.activeRound = this.fullTournament.activeRound;
                    this.noOfRounds = this.fullTournament.noOfRounds;
                    this.categories = this.fullTournament.CategoriesQL;
                    this.tournamentCategories =
                        this.dataFullTournament['TournamentQL'][0]['CategoriesQL'];
                    // this.playersUpdatedHandicap =
                    //   this.fullTournament.HandicapCalculated;

                    if (this.fullTournament.webLogoUrl)
                        this.webLogo = this.fullTournament.webLogoUrl;
                    else this.webLogo = Constants.DEFAULT_CLUB_LOGO;

                    if (this.activeRound > this.noOfRounds) {
                        if (this.fullTournament.prefix) {
                            this.selected = this.noOfRounds - 1;
                            //else //this.selected = this.activeRound - 1;

                            this.leaderboardUrl =
                                'https://app.gemgolfers.com/leaderboard/' +
                                this.fullTournament.prefix;
                        } else {
                            this.leaderboardUrl =
                                'https://app.gemgolfers.com/leaderboard/' +
                                this.tournamentID;
                        }
                    } else {
                        this.selected = this.activeRound - 1;
                    }
                    if (
                        this.dataFullTournament['TournamentQL'][0]['CategoriesQL']
                            .length == 0
                    ) {
                        this.playerCategoryList =
                            this.facadeService.getPlayerCategories();
                        //console.log(playerCategoryList);
                    }
                } else this.router.navigate(['/tournaments/']);

                //console.log(this.fullTournament);

                this.calculateStatistics();
                // if (this.tournamentPlayersAdd) {
                //     this.GrossData(
                //         this.dataFullTournament['TournamentQL'][0].CategoriesQL[0]
                //             .category
                //     );
                //     this.NetData(
                //         this.dataFullTournament['TournamentQL'][0].CategoriesQL[0]
                //             .category
                //     );
                // }
                if (this.activeRound > this.noOfRounds) {
                    if (this.selected == 0) {
                        this.getRound1stats(1);

                        this.calculateStatistics1();
                    } else if (this.selected == 1) {
                        this.getRound2stats(2);
                        this.calculateStatistics2();
                    } else if (this.selected == 2) {
                        this.getRound3stats(3);
                        this.calculateStatistics3();
                    } else if (this.selected == 3) {
                        this.getRound4stats(4);
                        this.calculateStatistics4();
                    } else {
                        this.getRound4stats(4);
                        this.calculateStatistics4();
                    }
                } else {
                    if (this.activeRound == 0) {
                        this.getRoundsstats();
                        //this.calculateStatistics();
                    } else if (this.activeRound == 1) {
                        this.getRound1stats(1);
                        //this.calculateStatistics();
                        this.calculateStatistics1();
                    } else if (this.activeRound == 2) {
                        this.getRound2stats(2);
                        this.calculateStatistics2();
                    } else if (this.activeRound == 3) {
                        this.getRound3stats(3);
                        this.calculateStatistics3();
                    } else if (this.activeRound == 4) {
                        this.getRound4stats(4);
                        this.calculateStatistics4();
                    } else {
                        this.getRound4stats(4);
                        this.calculateStatistics4();
                    }
                }

                //this.currentPlayer = <Player>await this.facadeService.getPlayerByID(this.playerID);
            } else {
                this.router.navigate(['/tournaments/']);
            }
        } catch (error) {
            this.logger.log('Getting View Tournament Data Failed', "error", error.toString());
        }
    }

    calculateStatistics() {
        try {


            this.FlightsQL = [];
            this.topMembers = [];
            this.AmateursCount = 0;
            this.JuniorsCount = 0;
            this.SeniorsCount = 0;
            this.VeteransCount = 0;
            this.LadiesCount = 0;
            this.AmateursPlayingDates = [];
            this.SeniorsPlayingDates = [];
            this.JuniorsPlayingDates = [];
            this.VeteransPlayingDates = [];
            this.LadiesPlayingDates = [];

            if (this.fullTournament.FlightsQL.length > 6) {
                this.FlightsQL = this.fullTournament.FlightsQL.slice(0, 7);
            } else {
                this.FlightsQL = this.fullTournament.FlightsQL;
            }
            // this.FlightsQL.slice(0,6);
            let totalPlayers =
                this.dataFullTournament['TournamentQL'][0]['members'];
            console.log(totalPlayers);

            totalPlayers.sort(this.ComparatorHandicap);
            console.log(totalPlayers);
            let count = 0;

            for (const c of totalPlayers) {
                if (count < 10) {
                    let obj = {
                        id: c.playerId,
                        title:
                            c.PlayerQL['firstName'] + ' ' + c.PlayerQL['lastName'],
                        handicap: c.PlayerQL['handicap'],
                        category: c.PlayerQL['playerCategory'],
                        class: c.PlayerQL['playerCategory'],
                    };
                    this.topMembers.push(obj);
                }
                count++;
            }
            console.log(this.topMembers);
            this.dataSourceMembersStatus = new MatTableDataSource(this.topMembers);
            this.totalPlayers =
                this.dataFullTournament['TournamentQL'][0]['members'].length;
            if (
                this.dataFullTournament['TournamentQL'][0]['CategoriesQL'].length ==
                0
            ) {
                const colors = ['warn', 'success', 'info', 'danger'];
                let indeca = 0;
                if (this.fullTournament.FlightsQL.length > 0) {
                    for (let c of this.fullTournament.FlightsQL) {
                        for (let index = 0; index < c.MembersQL.length; index++) {
                            if (c.MembersQL.length > indeca) {
                                this.membersData.push(
                                    c.MembersQL[indeca]['PlayerQL']
                                );
                                indeca++;
                            } else {
                                indeca = 0;
                            }
                        }
                    }
                } else if (this.fullTournament.members.length > 0) {
                    for (let c of this.fullTournament.members) {
                        this.membersData.push(c['PlayerQL']);
                    }
                }
                let index: number = 0;
                for (const c of this.playerCategoryList) {
                    let m = this.membersData.filter((a) => {
                        return a.playerCategory == c.name;
                    });

                    // const distinctThings = m.filter((thing, i, arr) => {
                    //   return arr.indexOf(arr.find(t => t.id === thing.id)) === i;
                    // });
                    if (m && m.length > 0) {
                        if (c.name == 'Amateurs') {
                            this.AmateursCount = m.length;
                        }
                        if (c.name.includes('Junior')) {
                            this.JuniorsCount = m.length;
                        }
                        if (c.name.includes('Senior')) {
                            this.SeniorsCount = m.length;
                        }
                        if (c.name == 'Professionals') {
                            this.VeteransCount = m.length;
                        }
                        if (c.name == 'Ladies') {
                            this.LadiesCount = m.length;
                        }
                        {
                            this.totalMembers += m.length;
                            let stat: any = {
                                title: c.name,
                                count: m.length,
                                class: colors[index],
                            };
                            this.membersStats.push(stat);
                            index++;

                            if (index > 3) index = 0;
                        }
                    }
                }
                console.log(this.SeniorsCount);

                console.log(this.membersStats);
                this.totalPlayers = this.totalMembers;
                console.log(this.totalMembers);

                let activeFights = this.fullTournament.FlightsQL.filter((a) => {
                    return a.flightRound == this.activeRound;
                });

                for (let flightData of activeFights) {
                    for (let member of flightData.MembersQL) {
                        if (member.ScoresQL.length > 0) {
                            this.scoreAdded = true;
                            break;
                        }
                    }
                }
            } else {
                console.log('dsdsds');
                const colors = ['warn', 'success', 'info', 'danger'];
                //console.log(this.fullTournament.FlightsQL);
                //console.log(this.playersCatgery.TournamentMemberQL[0]);
                for (
                    let index = 0;
                    index <
                    this.dataFullTournament['TournamentQL'][0]['members'].length;
                    index++
                ) {
                    this.membersData.push(
                        this.dataFullTournament['TournamentQL'][0]['members'][index]
                    );
                }
                console.log(this.membersData);
                //console.log(this.membersData);

                let index: number = 0;
                console.log(this.fullTournament.CategoriesQL);

                for (const c of this.fullTournament.CategoriesQL) {
                    let m = this.membersData.filter((a) => {
                        return a['PlayerQL'].playerCategory == c.category;
                    });

                    // const distinctThings = m.filter((thing, i, arr) => {
                    //   return arr.indexOf(arr.find(t => t.id === thing.id)) === i;
                    // });
                    if (c.category == 'Amateurs') {
                        this.AmateursCount = m.length;
                        if (
                            c.flightSettings &&
                            c.flightSettings['playingDate'] &&
                            c.flightSettings['playingDate'].length > 0
                        ) {
                            for (let obj of c.flightSettings['playingDate']) {
                                this.AmateursPlayingDates.push(obj);
                            }
                        } else if (
                            c.flightSettings &&
                            c.flightSettings.length > 0
                        ) {
                            for (let obj of c.flightSettings) {
                                this.AmateursPlayingDates.push(obj);
                            }
                        }
                    }
                    if (c.category.includes('Junior')) {
                        this.JuniorsCount = m.length;

                        if (
                            c.flightSettings &&
                            c.flightSettings['playingDate'] &&
                            c.flightSettings['playingDate'].length > 0
                        ) {
                            for (let obj of c.flightSettings['playingDate']) {
                                this.JuniorsPlayingDates.push(obj);
                            }
                        } else if (
                            c.flightSettings &&
                            c.flightSettings.length > 0
                        ) {
                            for (let obj of c.flightSettings) {
                                this.JuniorsPlayingDates.push(obj);
                            }
                        }
                    }
                    if (c.category.includes('Senior')) {
                        this.SeniorsCount = m.length;
                        if (
                            c.flightSettings &&
                            c.flightSettings['playingDate'] &&
                            c.flightSettings['playingDate'].length > 0
                        ) {
                            for (let obj of c.flightSettings['playingDate']) {
                                this.SeniorsPlayingDates.push(obj);
                            }
                        } else if (
                            c.flightSettings &&
                            c.flightSettings.length > 0
                        ) {
                            for (let obj of c.flightSettings) {
                                this.SeniorsPlayingDates.push(obj);
                            }
                        }
                    }
                    if (c.category == 'Professionals') {
                        this.VeteransCount = m.length;
                        if (
                            c.flightSettings &&
                            c.flightSettings['playingDate'] &&
                            c.flightSettings['playingDate'].length > 0
                        ) {
                            for (let obj of c.flightSettings['playingDate']) {
                                this.VeteransPlayingDates.push(obj);
                            }
                        } else if (
                            c.flightSettings &&
                            c.flightSettings.length > 0
                        ) {
                            for (let obj of c.flightSettings) {
                                this.VeteransPlayingDates.push(obj);
                            }
                        }
                    }
                    if (c.category == 'Ladies') {
                        this.LadiesCount = m.length;
                        if (
                            c.flightSettings &&
                            c.flightSettings['playingDate'] &&
                            c.flightSettings['playingDate'].length > 0
                        ) {
                            for (let obj of c.flightSettings['playingDate']) {
                                this.LadiesPlayingDates.push(obj);
                            }
                        } else if (
                            c.flightSettings &&
                            c.flightSettings.length > 0
                        ) {
                            for (let obj of c.flightSettings) {
                                this.LadiesPlayingDates.push(obj);
                            }
                        }
                    }
                    {
                        this.totalMembers += m.length;
                        let stat: any = {
                            title: c.category,
                            count: m.length,
                            class: colors[index],
                        };
                        this.membersStats.push(stat);
                        index++;

                        if (index > 3) index = 0;
                    }
                }

                let activeFights = this.fullTournament.FlightsQL.filter((a) => {
                    return a.flightRound == this.activeRound;
                });

                for (let flightData of activeFights) {
                    for (let member of flightData.MembersQL) {
                        if (member.ScoresQL.length > 0) {
                            this.scoreAdded = true;
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    calculateStatistics1() {
        try {


            this.FlightsQL = [];
            this.topMembers = [];
            this.FlightsQL = this.fullTournament.FlightsQL.filter((a) => {
                return a.flightRound == 1;
            });
            if (this.FlightsQL.length > 6) {
                this.FlightsQL.splice(6, this.FlightsQL.length);
            }
            let totalPlayers = [];
            for (const c of this.FlightsQL) {
                for (let obj of c['MembersQL']) {
                    totalPlayers.push(obj);
                }
            }
            console.log(totalPlayers);
            totalPlayers.sort(this.ComparatorHandicap);
            let count = 0;

            for (const c of totalPlayers) {
                if (count < 10) {
                    let obj = {
                        id: c.playerId,
                        title:
                            c.PlayerQL['firstName'] + ' ' + c.PlayerQL['lastName'],
                        handicap: c.PlayerQL['handicap'],
                        category: c.PlayerQL['playerCategory'],
                        class: c.PlayerQL['playerCategory'],
                    };
                    this.topMembers.push(obj);
                }
                count++;
            }
            console.log(this.topMembers);
            this.dataSourceMembersStatus = new MatTableDataSource(this.topMembers);
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    calculateStatistics2() {
        try {
            this.FlightsQL = [];
            this.topMembers = [];
            this.FlightsQL = this.fullTournament.FlightsQL.filter((a) => {
                return a.flightRound == 2;
            });
            if (this.FlightsQL.length > 6) {
                this.FlightsQL.splice(6, this.FlightsQL.length);
            }
            let totalPlayers = [];
            for (const c of this.FlightsQL) {
                for (let obj of c['MembersQL']) {
                    totalPlayers.push(obj);
                }
            }
            totalPlayers.sort(this.ComparatorHandicap);
            console.log(totalPlayers);
            let count = 0;

            for (const c of totalPlayers) {
                if (count < 10) {
                    let obj = {
                        id: c.playerId,
                        title:
                            c.PlayerQL['firstName'] + ' ' + c.PlayerQL['lastName'],
                        handicap: c.PlayerQL['handicap'],
                        category: c.PlayerQL['playerCategory'],
                        class: c.PlayerQL['playerCategory'],
                    };
                    this.topMembers.push(obj);
                }
                count++;
            }
            console.log(this.topMembers);
            this.dataSourceMembersStatus = new MatTableDataSource(this.topMembers);
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    calculateStatistics3() {
        try {
            this.FlightsQL = [];
            this.topMembers = [];
            this.FlightsQL = this.fullTournament.FlightsQL.filter((a) => {
                return a.flightRound == 3;
            });
            if (this.FlightsQL.length > 6) {
                this.FlightsQL.splice(6, this.FlightsQL.length);
            }
            let totalPlayers = [];
            for (const c of this.FlightsQL) {
                for (let obj of c['MembersQL']) {
                    totalPlayers.push(obj);
                }
            }
            totalPlayers.sort(this.ComparatorHandicap);
            console.log(totalPlayers);
            let count = 0;

            for (const c of totalPlayers) {
                if (count < 10) {
                    let obj = {
                        id: c.playerId,
                        title:
                            c.PlayerQL['firstName'] + ' ' + c.PlayerQL['lastName'],
                        handicap: c.PlayerQL['handicap'],
                        category: c.PlayerQL['playerCategory'],
                        class: c.PlayerQL['playerCategory'],
                    };
                    this.topMembers.push(obj);
                }
                count++;
            }
            console.log(this.topMembers);
            this.dataSourceMembersStatus = new MatTableDataSource(this.topMembers);
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    calculateStatistics4() {
        try {
            this.FlightsQL = [];
            this.topMembers = [];
            this.FlightsQL = this.fullTournament.FlightsQL.filter((a) => {
                return a.flightRound == 4;
            });
            if (this.FlightsQL.length > 6) {
                this.FlightsQL.splice(6, this.FlightsQL.length);
            }
            let totalPlayers = [];
            for (const c of this.FlightsQL) {
                for (let obj of c['MembersQL']) {
                    totalPlayers.push(obj);
                }
            }
            totalPlayers.sort(this.ComparatorHandicap);
            console.log(totalPlayers);
            let count = 0;

            for (const c of totalPlayers) {
                if (count < 10) {
                    let obj = {
                        id: c.playerId,
                        title:
                            c.PlayerQL['firstName'] + ' ' + c.PlayerQL['lastName'],
                        handicap: c.PlayerQL['handicap'],
                        category: c.PlayerQL['playerCategory'],
                        class: c.PlayerQL['playerCategory'],
                    };
                    this.topMembers.push(obj);
                }
                count++;
            }
            console.log(this.topMembers);
            this.dataSourceMembersStatus = new MatTableDataSource(this.topMembers);
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    public onChangeGross(event) {
        console.log(event);
        this.selectedCategory = this.tournamentCategories[event.index].category;
        console.log(this.selectedCategory);
        if (this.showSummary) this.GrossData(this.selectedCategory);
    }
    public onChangeNet(event) {
        console.log(event);
        this.selectedCategory = this.tournamentCategories[event.index].category;
        console.log(this.selectedCategory);
        if (this.showSummary) this.NetData(this.selectedCategory);
        this.showSummary = true;
    }
    tabClicked(tab: any) {
        try {
            if (tab.index == 0 && tab.tab['textLabel'] !== 'Summary') {
                this.calculateStatistics1();
                this.getRound1stats(1);
                // this.getRound1stats(1);
                // this.GrossData(this.tournamentCategories[0].category);
                // this.NetData(this.tournamentCategories[0].category);
            } else if (tab.index == 1 && tab.tab['textLabel'] !== 'Summary') {
                this.calculateStatistics2();
                this.getRound2stats(2);
            } else if (tab.index == 2 && tab.tab['textLabel'] !== 'Summary') {
                this.calculateStatistics3();
                this.getRound3stats(3);
            } else if (tab.index == 3 && tab.tab['textLabel'] !== 'Summary') {
                this.calculateStatistics4();
                this.getRound4stats(4);
            } else if (tab.index == 4 && tab.tab['textLabel'] !== 'Summary') {
                this.calculateStatistics4();
                this.getRound4stats(4);
            } else {
                this.GrossData(
                    this.dataFullTournament['TournamentQL'][0].CategoriesQL[0]
                        .category
                );
                this.NetData(
                    this.dataFullTournament['TournamentQL'][0].CategoriesQL[0]
                        .category
                );
            }
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    maintabClicked(tab: any) {
        try {
            this.logger.log('Admin click on Main Tab in View Tournament Page', "info", tab.toString());
            if (!this.showMatchPlay) {
                if (tab.index == 0) {
                    this.showMainTab1 = true;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                    if (this.activeRound == 1) this.calculateStatistics1();
                    this.getRound1stats(1);
                    if (this.activeRound == 2) this.calculateStatistics2();
                    this.getRound2stats(2);
                    if (this.activeRound == 3) this.calculateStatistics3();
                    this.getRound3stats(3);
                    if (this.activeRound == 4) this.calculateStatistics4();
                    this.getRound4stats(4);
                } else if (tab.index == 1) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = true;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                } else if (tab.index == 2) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = true;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                } else if (tab.index == 3) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = true;
                    this.showMainTab5 = false;
                } else if (tab.index == 4) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.getTournamentMembers();
                    this.showMainTab5 = true;
                }
            } else {
                if (tab.index == 0) {
                    this.showMainTab1 = true;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                    this.showMainTab6 = false;
                    if (this.activeRound == 1) this.calculateStatistics1();
                    this.getRound1stats(1);
                    if (this.activeRound == 2) this.calculateStatistics2();
                    this.getRound2stats(2);
                    if (this.activeRound == 3) this.calculateStatistics3();
                    this.getRound3stats(3);
                    if (this.activeRound == 4) this.calculateStatistics4();
                    this.getRound4stats(4);
                } else if (tab.index == 1) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = true;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                    this.showMainTab6 = false;
                } else if (tab.index == 2) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                    this.showMainTab6 = true;
                } else if (tab.index == 3) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = true;
                    this.showMainTab4 = false;
                    this.showMainTab5 = false;
                    this.showMainTab6 = false;
                } else if (tab.index == 4) {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = true;
                    this.showMainTab5 = false;
                    this.showMainTab6 = false;
                } else {
                    this.showMainTab1 = false;
                    this.showMainTab2 = false;
                    this.showMainTab3 = false;
                    this.showMainTab4 = false;
                    this.getTournamentMembers();
                    this.showMainTab5 = true;
                    this.showMainTab6 = false;

                }
            }

        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }

    getRoundsstats() {
        try {
            if (this.roundsStats) return;

            let roundFlights = this.fullTournament.FlightsQL;

            let stats = new AppStats(roundFlights, this.fullTournament.CourseQL);
            let finalScoreStats: ScoreStats = stats.getApplicationStats();
            console.log(finalScoreStats);

            this.avgScore['par3Avg'] = finalScoreStats.par3Stats.getAvgScores();
            this.avgScore['par4Avg'] = finalScoreStats.par4Stats.getAvgScores();
            this.avgScore['par5Avg'] = finalScoreStats.par5Stats.getAvgScores();
            this.avgScore['shotsBirdiesPercent'] =
                finalScoreStats.getShotsBirdiesPercent();
            this.avgScore['shotsBogeysPercent'] =
                finalScoreStats.getShotsBogeysPercent();
            this.avgScore['shotsThreeOrHigherPercent'] =
                finalScoreStats.getShotsThreeOrHigherPercent();
            this.avgScore['shotsParsPercent'] =
                finalScoreStats.getShotsParsPercent();
            this.avgScore['shotsDoubleBogeysPercent'] =
                finalScoreStats.getShotsDoubleBogeysPercent();

            this.chartavgScore.push(
                Math.floor(Number(finalScoreStats.par3Stats.getAvgScores()))
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.par4Stats.getAvgScores())
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.par5Stats.getAvgScores())
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.getShotsBirdiesPercent())
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.getShotsBogeysPercent())
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.getShotsThreeOrHigherPercent())
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.getShotsParsPercent())
            );
            this.chartavgScore.push(
                Math.floor(finalScoreStats.getShotsDoubleBogeysPercent())
            );
            this._series['0'] = [
                {
                    data: this.chartavgScore,
                    name: 'Members',
                    type: 'line',
                },
                {
                    data: this.chartavgScore,
                    name: 'Rounds',
                    type: 'column',
                },
            ];
            console.log(this._series);

            if (finalScoreStats['grossTotal'] != 0) {
                this.pieChartData1 = [
                    General.precisionRound(this.avgScore['par3Avg'], 2),
                    General.precisionRound(this.avgScore['par4Avg'], 2),
                    General.precisionRound(this.avgScore['par5Avg'], 2),
                ];
                this.roundsStats = true;
            } else {
                this.pieChartData1 = [0.01, 0.01, 0.01];
                this.roundsStats = false;
            }

            this.chart();
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    getRound1stats(round: number) {
        // if (this.round1Stats) return;
        this.avgScore1 = [];
        this.chartavgScore1 = [];
        this.pieChartData1 = [];
        this._series = [];

        let roundFlights = this.fullTournament.FlightsQL.filter((a) => {
            return a.flightRound == round;
        });

        let stats = new AppStats(roundFlights, this.fullTournament.CourseQL);
        let finalScoreStats: ScoreStats = stats.getApplicationStats();
        console.log(finalScoreStats);

        this.avgScore1['par3Avg'] = finalScoreStats.par3Stats.getAvgScores();
        this.avgScore1['par4Avg'] = finalScoreStats.par4Stats.getAvgScores();
        this.avgScore1['par5Avg'] = finalScoreStats.par5Stats.getAvgScores();

        this.avgScore1['shotsBirdiesPercent'] =
            finalScoreStats.getShotsBirdiesPercent();
        this.avgScore1['shotsBogeysPercent'] =
            finalScoreStats.getShotsBogeysPercent();
        this.avgScore1['shotsThreeOrHigherPercent'] =
            finalScoreStats.getShotsThreeOrHigherPercent();
        this.avgScore1['shotsParsPercent'] =
            finalScoreStats.getShotsParsPercent();
        this.avgScore1['shotsDoubleBogeysPercent'] =
            finalScoreStats.getShotsDoubleBogeysPercent();

        this.chartavgScore1.push(
            Math.round(finalScoreStats.getShotsBirdiesPercent())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.getShotsParsPercent())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.getShotsBogeysPercent())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.getShotsDoubleBogeysPercent())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.getShotsThreeOrHigherPercent())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.par3Stats.getAvgScores())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.par4Stats.getAvgScores())
        );
        this.chartavgScore1.push(
            Math.floor(finalScoreStats.par5Stats.getAvgScores())
        );

        this._series['0'] = [
            {
                data: this.chartavgScore1,
                name: 'Average',
                type: 'line',
            },
            {
                data: this.chartavgScore1,
                name: 'Average',
                type: 'column',
            },
        ];
        console.log(this._series);

        if (finalScoreStats['grossTotal'] != 0) {
            this.pieChartData1 = [
                General.precisionRound(this.avgScore['par3Avg'], 2),
                General.precisionRound(this.avgScore['par4Avg'], 2),
                General.precisionRound(this.avgScore['par5Avg'], 2),
            ];
        } else {
            this.pieChartData1 = [0.01, 0.01, 0.01];
        }

        this.chart();

        this.round1Stats = true;
    }

    getRound2stats(round: number) {
        // if (this.round2Stats) return;
        this.avgScore2 = [];
        this.chartavgScore2 = [];
        this.pieChartData2 = [];
        this._series = [];
        let roundFlights = this.fullTournament.FlightsQL.filter((a) => {
            return a.flightRound == round;
        });

        let stats = new AppStats(roundFlights, this.fullTournament.CourseQL);
        let finalScoreStats: ScoreStats = stats.getApplicationStats();

        this.avgScore2['par3Avg'] = finalScoreStats.par3Stats.getAvgScores();
        this.avgScore2['par4Avg'] = finalScoreStats.par4Stats.getAvgScores();
        this.avgScore2['par5Avg'] = finalScoreStats.par5Stats.getAvgScores();

        this.avgScore2['shotsBirdiesPercent'] =
            finalScoreStats.getShotsBirdiesPercent();
        this.avgScore2['shotsBogeysPercent'] =
            finalScoreStats.getShotsBogeysPercent();
        this.avgScore2['shotsThreeOrHigherPercent'] =
            finalScoreStats.getShotsThreeOrHigherPercent();
        this.avgScore2['shotsParsPercent'] =
            finalScoreStats.getShotsParsPercent();
        this.avgScore2['shotsDoubleBogeysPercent'] =
            finalScoreStats.getShotsDoubleBogeysPercent();
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.getShotsBirdiesPercent())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.getShotsParsPercent())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.getShotsBogeysPercent())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.getShotsDoubleBogeysPercent())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.getShotsThreeOrHigherPercent())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.par3Stats.getAvgScores())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.par4Stats.getAvgScores())
        );
        this.chartavgScore2.push(
            Math.floor(finalScoreStats.par5Stats.getAvgScores())
        );

        this._series['0'] = [
            {
                data: this.chartavgScore2,
                name: 'Average',
                type: 'line',
            },
            {
                data: this.chartavgScore2,
                name: 'Average',
                type: 'column',
            },
        ];

        // this.pieChartData2 = [
        //   General.precisionRound(this.avgScore2["par3Avg"], 2),
        //   General.precisionRound(this.avgScore2["par4Avg"], 2),
        //   General.precisionRound(this.avgScore2["par5Avg"], 2),
        // ];
        if (finalScoreStats['grossTotal'] != 0) {
            this.pieChartData2 = [
                General.precisionRound(this.avgScore2['par3Avg'], 2),
                General.precisionRound(this.avgScore2['par4Avg'], 2),
                General.precisionRound(this.avgScore2['par5Avg'], 2),
            ];
        } else {
            this.pieChartData2 = [0.01, 0.01, 0.01];
        }
        this.round2Stats = true;
        this.chart();
    }

    getRound3stats(round: number) {
        // if (this.round3Stats) return;
        this.avgScore3 = [];
        this.chartavgScore3 = [];
        this.pieChartData3 = [];
        this._series = [];

        let roundFlights = this.fullTournament.FlightsQL.filter((a) => {
            return a.flightRound == round;
        });

        let stats = new AppStats(roundFlights, this.fullTournament.CourseQL);
        let finalScoreStats: ScoreStats = stats.getApplicationStats();

        this.avgScore3['par3Avg'] = finalScoreStats.par3Stats.getAvgScores();
        this.avgScore3['par4Avg'] = finalScoreStats.par4Stats.getAvgScores();
        this.avgScore3['par5Avg'] = finalScoreStats.par5Stats.getAvgScores();

        this.avgScore3['shotsBirdiesPercent'] =
            finalScoreStats.getShotsBirdiesPercent();
        this.avgScore3['shotsBogeysPercent'] =
            finalScoreStats.getShotsBogeysPercent();
        this.avgScore3['shotsThreeOrHigherPercent'] =
            finalScoreStats.getShotsThreeOrHigherPercent();
        this.avgScore3['shotsParsPercent'] =
            finalScoreStats.getShotsParsPercent();
        this.avgScore3['shotsDoubleBogeysPercent'] =
            finalScoreStats.getShotsDoubleBogeysPercent();
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.getShotsBirdiesPercent())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.getShotsParsPercent())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.getShotsBogeysPercent())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.getShotsDoubleBogeysPercent())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.getShotsThreeOrHigherPercent())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.par3Stats.getAvgScores())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.par4Stats.getAvgScores())
        );
        this.chartavgScore3.push(
            Math.floor(finalScoreStats.par5Stats.getAvgScores())
        );

        this._series['0'] = [
            {
                data: this.chartavgScore3,
                name: 'Average',
                type: 'line',
            },
            {
                data: this.chartavgScore3,
                name: 'Average',
                type: 'column',
            },
        ];
        if (finalScoreStats['grossTotal'] != 0) {
            this.pieChartData3 = [
                General.precisionRound(this.avgScore3['par3Avg'], 2),
                General.precisionRound(this.avgScore3['par4Avg'], 2),
                General.precisionRound(this.avgScore3['par5Avg'], 2),
            ];
        } else {
            this.pieChartData3 = [0.01, 0.01, 0.01];
        }
        this.chart();
        this.round3Stats = true;
    }

    getRound4stats(round: number) {
        // if (this.round4Stats) return;
        this.avgScore4 = [];
        this.chartavgScore4 = [];
        this.pieChartData4 = [];
        this._series = [];

        let roundFlights = this.fullTournament.FlightsQL.filter((a) => {
            return a.flightRound == round;
        });

        let stats = new AppStats(roundFlights, this.fullTournament.CourseQL);
        let finalScoreStats: ScoreStats = stats.getApplicationStats();

        this.avgScore4['par3Avg'] = finalScoreStats.par3Stats.getAvgScores();
        this.avgScore4['par4Avg'] = finalScoreStats.par4Stats.getAvgScores();
        this.avgScore4['par5Avg'] = finalScoreStats.par5Stats.getAvgScores();

        this.avgScore4['shotsBirdiesPercent'] =
            finalScoreStats.getShotsBirdiesPercent();
        this.avgScore4['shotsBogeysPercent'] =
            finalScoreStats.getShotsBogeysPercent();
        this.avgScore4['shotsThreeOrHigherPercent'] =
            finalScoreStats.getShotsThreeOrHigherPercent();
        this.avgScore4['shotsParsPercent'] =
            finalScoreStats.getShotsParsPercent();
        this.avgScore4['shotsDoubleBogeysPercent'] =
            finalScoreStats.getShotsDoubleBogeysPercent();
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.getShotsBirdiesPercent())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.getShotsParsPercent())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.getShotsBogeysPercent())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.getShotsDoubleBogeysPercent())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.getShotsThreeOrHigherPercent())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.par3Stats.getAvgScores())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.par4Stats.getAvgScores())
        );
        this.chartavgScore4.push(
            Math.floor(finalScoreStats.par5Stats.getAvgScores())
        );

        this._series['0'] = [
            {
                data: this.chartavgScore4,
                name: 'Average',
                type: 'line',
            },
            {
                data: this.chartavgScore4,
                name: 'Average',
                type: 'column',
            },
        ];
        if (finalScoreStats['grossTotal'] != 0) {
            this.pieChartData4 = [
                General.precisionRound(this.avgScore4['par3Avg'], 2),
                General.precisionRound(this.avgScore4['par4Avg'], 2),
                General.precisionRound(this.avgScore4['par5Avg'], 2),
            ];
        } else {
            this.pieChartData4 = [0.01, 0.01, 0.01];
        }
        this.chart();
        this.round4Stats = true;
    }

    chart() {
        this.chartGithubIssues = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: [
                '#A70606',
                '#DC5B11',
                '#0F0F03',
                '#061797',
                '#DDDED8',
                '#C109AE',
                '#0A9928',
                '#450707',
            ],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },
            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: this.barChartLabels,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: this._series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };
    }

    viewMarshalList() {
        try {
            this.logger.log('Admin click on marshals btn', "info");
            const dialogRef = this.dialog.open(DialogMarshalComponent, {
                width: '700px',
                data: { marshals: this.fullTournament.MarshalQL },
            });

            dialogRef.afterClosed().subscribe((result) => {
                //console.log(result);
                if (result) {
                    //console.log(result.player);
                } else {
                    //console.log("cancel delete action");
                }
            });
        } catch (error) {
            this.logger.log('Getting Marshals Data Failed', "error", error.toString());
        }
    }

    // async closeRound(round: number) {

    //   const dialogRef = this.dialog.open(DialogCloseRoundComponent, {
    //     width: '500px',
    //     data: { round: round }
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     let getResult: any = result;
    //     if(getResult) {

    //       console.log(getResult);

    //       let cutOffCriteria: any = {
    //         round: round,
    //         copyFlights: true,
    //         score: getResult.score,
    //         type: getResult.type,
    //         order: getResult.order
    //       }
    //       console.log(cutOffCriteria);

    //       let result = this.facadeService.closeActiveRound(this.tournamentID, round, cutOffCriteria);
    //       //console.log(result);
    //       this.activeRound = round;
    //       this.selected = round

    //       this.closeCurrentRound();
    //     }
    //     else {
    //       //console.log("cancel delete action");
    //     }
    //   });

    // }
    calculateDiff(startDate, endDate) {
        let days = Math.floor(
            (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
        );
        return days;
    }

    async closeRound() {
        try {
            this.logger.log('Admin Click on Close Round Tournament btn', "info", this.activeRound.toString());
            if (this.activeRound == this.noOfROund) {
                this.logger.log('Close Round Dialog Box Open', "info", this.noOfROund.toString());
                const dialogRef = this.dialog.open(DialogOverviewComponent, {
                    width: '350px',
                    data: 'Do you want to close the last round?',
                });

                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result) {
                        const resultString = JSON.stringify(result);
                        this.logger.log('Result from Close Round Dialog Box', "info", resultString);
                        await this.facadeService.closeActiveRound(
                            this.tournamentID,
                            this.activeRound + 1,
                            this.fullTournament.cutOffCriteria
                        );
                        window.location.reload();
                    } else {
                        this.logger.log('Close Round Dialog Box Close Without Save', "info");
                        //console.log("cancel delete action");
                    }
                });
            } else {
                this.logger.log('Close Round Dialog Box Open', "info", this.noOfROund.toString());
                let allowCat: boolean = false;
                this.activeTournamentMembers = [];
                let flights = this.dataFullTournament['TournamentQL'][0].FlightsQL;
                let startDate =
                    this.dataFullTournament['TournamentQL'][0].startDate;
                startDate = new Date(startDate);
                startDate.setDate(startDate.getDate() + this.activeRound);
                console.log(startDate);

                let newstartDate = startDate.getDate();

                console.log(newstartDate);

                for (let newObj of this.categories) {
                    let flightSettings: any = newObj.flightSettings;

                    if (
                        Object.prototype.toString
                            .call(flightSettings)
                            .indexOf('Array') > -1 &&
                        flightSettings.length > 0
                    ) {
                        for (let obj of flightSettings) {
                            let chngDate = obj.dates.replaceAll('-', '').toString();
                            let newDate =
                                chngDate.substring(4, 8) +
                                '-' +
                                chngDate.substring(2, 4) +
                                '-' +
                                +chngDate.substring(0, 2);
                            // console.log(newDate);

                            let flightDate = new Date(newDate).getDate();
                            console.log(flightDate);
                            if (flightDate == newstartDate) {
                                allowCat = true;
                                newObj['allowCat'] = true;
                                break;
                            }

                            //console.log(this.calculateDiff(newstartDate,flightDate));
                        }
                        if (!allowCat) {
                            newObj['allowCat'] = false;
                        }
                        for (let obj of flights) {
                            if (obj.flightRound == this.activeRound) {
                                let check = obj.MembersQL.filter((a) => {
                                    return (
                                        a.PlayerQL.playerCategory == newObj.category
                                    );
                                });
                                if (check.length > 0) {
                                    newObj['cut'] = true;
                                    check = [];
                                    break;
                                } else {
                                    newObj['cut'] = false;
                                }
                            }
                        }
                    } else if (
                        Object.prototype.toString
                            .call(flightSettings)
                            .indexOf('Object') > -1
                    ) {
                        for (let obj of flightSettings['playingDate']) {
                            let chngDate = obj.dates.replaceAll('-', '').toString();
                            let newDate =
                                chngDate.substring(4, 8) +
                                '-' +
                                chngDate.substring(2, 4) +
                                '-' +
                                +chngDate.substring(0, 2);

                            let flightDate = new Date(newDate).getDate();
                            console.log(flightDate);
                            if (flightDate == newstartDate) {
                                allowCat = true;
                                newObj['allowCat'] = true;
                                break;
                            }
                            //console.log(this.calculateDiff(newstartDate,flightDate));
                        }
                        if (!allowCat) {
                            newObj['allowCat'] = false;
                        }
                        for (let obj of flights) {
                            if (obj.flightRound == this.activeRound) {
                                let check = obj.MembersQL.filter((a) => {
                                    return (
                                        a.PlayerQL.playerCategory == newObj.category
                                    );
                                });
                                if (check.length > 0) {
                                    newObj['cut'] = true;
                                    check = [];
                                    break;
                                } else {
                                    newObj['cut'] = false;
                                }
                            }
                        }
                    } else {
                        for (let obj of flights) {
                            if (obj.flightRound == this.activeRound) {
                                let check = obj.MembersQL.filter((a) => {
                                    return (
                                        a.PlayerQL.playerCategory == newObj.category
                                    );
                                });
                                if (check.length > 0) {
                                    newObj['cut'] = true;
                                    check = [];
                                    break;
                                } else {
                                    newObj['cut'] = false;
                                }
                            }
                        }
                        newObj['allowCat'] = true;
                    }
                }
                const dialogRef = this.dialog.open(DialogCloseRoundComponent, {
                    width: '800px',
                    data: {
                        round: this.activeRound + 1,
                        categories: this.categories,
                        tournament: this.tournamentID,
                        startDate:
                            this.dataFullTournament.TournamentQL[0].startDate,
                    },
                });
                dialogRef.afterClosed().subscribe(async (result) => {

                    let getResult: any = result;
                    var jsons = new Array();
                    let flag = true;
                    jsons = [];
                    console.log(getResult);
                    if (getResult && getResult.category) {
                        console.log(getResult.category);
                        for (let cats in getResult.category) {
                            if (getResult.category[cats].copyFlights == 'No') {
                                flag = false;
                            }

                            console.log(getResult.category[cats]);
                            let copyflights: any = [];
                            if (
                                this.fullTournament.cutOffCriteria != null &&
                                Object.keys(
                                    this.fullTournament.cutOffCriteria.cutOff[0]
                                ).length > 0
                            ) {
                                for (let cut of this.fullTournament.cutOffCriteria[
                                    'cutOff'
                                ]) {
                                    if (
                                        cut.name == getResult.category[cats].name &&
                                        getResult.category[cats].cuttScore == ''
                                    ) {
                                        copyflights.push(cut);
                                    }
                                }
                                console.log(copyflights);
                            }

                            let cutOffCriteria: any = {
                                round:
                                    copyflights.length > 0
                                        ? copyflights[0].round
                                        : this.activeRound,
                                //copyFlights: (getResult.category[cats].copy == "1"),
                                copymembers:
                                    copyflights.length > 0
                                        ? copyflights[0].score
                                        : null,
                                copyflights: getResult.category[cats].copyFlights,
                                name: getResult.category[cats].name,
                                players: getResult.category[cats].players,
                                time: getResult.category[cats].time,
                                interval: getResult.category[cats].interval,
                                tee: getResult.category[cats].tee,
                                score:
                                    copyflights.length > 0
                                        ? copyflights[0].score
                                        : flag == false
                                            ? getResult.category[cats].cuttScore
                                            : 1000,
                                type: getResult.category[cats].type,
                                order: getResult.category[cats].order,
                                playing: getResult.category[cats].playing,
                                lastRoundPlayed:
                                    getResult.category[cats].lastRoundPlayed,
                            };
                            console.log(cutOffCriteria);
                            await this.closeCurrentRound(
                                cutOffCriteria,
                                cutOffCriteria.name,
                                cutOffCriteria.score,
                                cutOffCriteria.copymembers
                            );
                            // this.dataFullTournament =
                            //     await this.facadeService.tournamentDashBoard(
                            //         this.tournamentID
                            //     );
                            jsons.push(cutOffCriteria);
                        }
                        let jObject = { cutOff: jsons };
                        console.log(jObject);
                        let a = JSON.stringify(jObject);
                        var src = a.replace(/\\/g, '');
                        console.log(src);
                        const resultString = JSON.stringify(result);
                        this.logger.log('Result from Close Round Dialog Box', "info", resultString);
                        let response = await this.facadeService.closeActiveRound(
                            this.tournamentID,
                            this.activeRound + 1,
                            jObject
                        );
                        if (response) {
                            window.location.reload();
                        }
                    } else {
                        //console.log("cancel delete action");
                    }
                });
            }
        } catch (error) {
            this.logger.log('Close Tournament Round Failed', "error", error.toString());
        }
    }

    showCourseDetails() {
        this.dialog.open(DialogCourseDetailsComponent, {
            data: {
                course: this.dataFullTournament['TournamentQL'][0]['CourseQL']
                    .id,
            },
        });
    }

    async closeCurrentRound(
        cutOffCriteria: any,
        categoryName: string,
        categoryScore: number,
        copymembers: any
    ) {
        try {
            this.logger.log('Cut calculation after Close Round.', "info", cutOffCriteria.toString());
            let nextRoundPlayers: any[] = [];
            // console.log(category);
            // let categoryScore = cutOffCriteria.score.filter((a) => {
            //   return a.name == category;
            // });
            let objLeader: Leader = new Leader(
                this.fullTournament,
                this.activeRound,
                this.fullTournament,
                categoryName
            );
            let result = objLeader.parseSubscriptionResponse();
            console.log(result);
            if (cutOffCriteria.copyflights == 'No') {
                if (result.length == 0) {
                    result = this.dataFullTournament.TournamentQL[0].members.filter(
                        (a) => {
                            if (a.PlayerQL.playerCategory == categoryName)
                                return nextRoundPlayers.push(a.PlayerQL);
                        }
                    );
                    //for(let res in this.dataFullTournament.TournamentQL[0].members){
                    //if((this.dataFullTournament.TournamentQL[0].members[res].PlayerQL.playerCategory) == categoryName){
                    //nextRoundPlayers.push(this.dataFullTournament.TournamentQL[0].members[res].PlayerQL)

                    //nextRoundPlayers = result.PlayerQL;
                    //}
                    //}
                    console.log(nextRoundPlayers);
                } else {
                    if (cutOffCriteria.type == LeaderType.GROSS) {
                        result = result.filter((a) => {
                            return (
                                a.AllGrossUnder <=
                                (categoryScore
                                    ? categoryScore
                                    : a.AllGrossUnder) &&
                                a['holes' + this.activeRound] ==
                                this.noOfHolesInCourse
                            );
                        });
                        console.log(result);
                        cutOffCriteria.order == 'asc'
                            ? (nextRoundPlayers = result.sort(
                                this.ComparatorAllGross
                            ))
                            : (nextRoundPlayers = result.sort(
                                this.ComparatorAllGrossDesc
                            ));
                    } else if (cutOffCriteria.type == LeaderType.NEW) {
                        result =
                            this.dataFullTournament.TournamentQL[0].members.filter(
                                (a) => {
                                    if (a.PlayerQL.playerCategory == categoryName)
                                        return nextRoundPlayers.push(a.PlayerQL);
                                }
                            );
                        this.makePlayerFlights(result, cutOffCriteria.players);
                        //console.log(this.selectedMembers);
                        this.saveCategoryFlights(cutOffCriteria, categoryName);
                    } else {
                        result = result.filter((a) => {
                            return (
                                a.AllNetUnder <=
                                (categoryScore
                                    ? categoryScore
                                    : a.AllNetUnder) &&
                                a['holes' + this.activeRound] ==
                                this.noOfHolesInCourse
                            );
                        });
                        cutOffCriteria.order == 'asc'
                            ? (nextRoundPlayers = result.sort(
                                this.ComparatorAllNet
                            ))
                            : (nextRoundPlayers = result.sort(
                                this.ComparatorAllNetDesc
                            ));
                    }
                }
                //nextRoundPlayers = result.sort(this.ComparatorAllGross);
                //for(let p of nextRoundPlayers) console.log(p.name + "" + p.playerId);
                console.log(nextRoundPlayers);
                if (copymembers == null) {
                    this.makePlayerFlights(
                        nextRoundPlayers,
                        cutOffCriteria.players
                    );
                    //console.log(this.selectedMembers);
                    await this.saveCategoryFlights(cutOffCriteria, categoryName);
                }
            } else {
                nextRoundPlayers = result;
                this.makePlayerFlights(nextRoundPlayers, cutOffCriteria.players);
                //console.log(this.selectedMembers);
                this.saveCategoryFlights(cutOffCriteria, categoryName);
            }
        } catch (error) {
            this.logger.log('Cut calculation Failed after Close Round.', "info", cutOffCriteria.toString());
        }
        // for(let p of nextRoundPlayers) {
        //   let tm: TournamentMember = {
        //     tournamentId: this.tournamentID,
        //     playerId: p.playerId,
        //     status: true
        //   }
        //   this.activeTournamentMembers.push(tm);
        // }
        //this.markActiveTournamentMembers(this.activeTournamentMembers);
    }

    async makePlayerFlights(nextRoundPlayers: any, playersPerFlight: number) {
        try {


            let cnter = 0;
            let outer = 0;
            this.selectedMembers = [];

            //console.log(this.selectedMembers);
            for (var index in nextRoundPlayers) {
                //console.log(outer + "<--->" + cnter);

                if (cnter == 0) this.selectedMembers[outer] = [];

                this.selectedMembers[outer][cnter] = nextRoundPlayers[index];

                if (cnter == playersPerFlight - 1) {
                    cnter = 0;
                    outer++;
                } else {
                    cnter++;
                }
            }
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }

    async saveCategoryFlights(criteria: any, categoryName: any) {
        try {
            let tournamentFlights: Flight[] = [];
            //let fcnter = 0;
            //console.log(criteria);
            this.changer++;

            let tournamentFlightMembers: FlightMembers[];
            let teeBox: number;
            let teeTime: string = criteria.time;
            for (var index in this.selectedMembers) {
                tournamentFlightMembers = [];
                for (var index2 in this.selectedMembers[index]) {
                    if (Number.isInteger(Number(index2))) {
                        // console.log(this.selectedMembers[index][index2]["playerCategory"]);
                        // console.log(this.selectedMembers[index][index2].playerCategory);
                        //console.log(categoryName);
                        // console.log(this.selectedMembers[index][index2]["name"]);

                        let roundTeeId: any = General.getPlayersTe(categoryName);
                       // console.log(roundTeeId.id);
                        let FM: any = {
                            playerId: this.selectedMembers[index][index2]['id']
                                ? this.selectedMembers[index][index2]['id']
                                : this.selectedMembers[index][index2]['playerId'],
                            attendance: false,
                            playingTee: roundTeeId.result,
                            tee_id: roundTeeId.id,
                        };

                        tournamentFlightMembers.push(FM);
                    }
                }
                if (tournamentFlightMembers.length > 0) {
                    //console.log(tournamentFlightMembers);
                   // console.log('Before Running' + this.runningFlights);
                    this.runningFlights++;
                    this.teetime++;
                    //let startingHole = parseFloat((<HTMLInputElement>document.getElementById("flight_" + index + "_hole")).value);
                    //let startTime : string = (<HTMLInputElement>document.getElementById("flight_" + index + "_time")).value;
                    let currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() + 1);
                    teeBox = this.getNextTeeBox(criteria.tee, this.teetime);
                    teeTime = this.getNextFlightTime(
                        teeTime,
                        criteria.interval,
                        criteria.tee,
                        this.teetime,
                        teeBox
                    );
                   // console.log(teeBox);
                   // console.log(teeTime);
                   // console.log(General.parseToDate(currentDate.toDateString()));
                    let roundTeeId: any = General.getPlayersTe(categoryName);
                    console.log(roundTeeId.id);
                    let flight: any = {
                        id: UniqueIdGenerator.generate(),
                        tournamentId: this.tournamentID,
                        courseId: this.fullTournament.courseId,
                        adminId: this.loggedInUser.id,
                        courseHoleSets: 0,
                        flightNo: this.runningFlights,
                        flightRound: this.activeRound + 1,
                        startingHole: teeBox,
                        tee: roundTeeId.result,
                        tee_id: roundTeeId.id,
                        category: categoryName,
                        date: General.parseToDate(currentDate.toDateString()),
                        time: teeTime,
                        ended: false,
                        members: {
                            data: tournamentFlightMembers,
                        },
                    };
                    //console.log(flight);
                    tournamentFlights.push(flight);
                    //break;
                    //console.log('After loop' + this.runningFlights);
                }
            }
            this.teetime = 0;
            await this.facadeService.createNextRoundFlights(tournamentFlights);
            //console.log(tournamentFlights);
           // console.log('After Function' + this.runningFlights);
        } catch (error) {
            this.logger.log('Getting Tournaments Data Failed', "error", error.toString());
        }
    }
    downloadResultSheet() {
        let doc = new jsPDF();
        let col = General.createClm(this.noOfRounds);

        doc.setFontSize(22);
        doc.setFillColor(0, 0, 0);
        doc.rect(10, 5, 190, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(this.fullTournament.title, 13, 12, 'justify');
        doc.text('\nScore Sheet', 13, 12, 'justify');

        this.tournamentCategories.forEach((element) => {
            this.getSummaryData(element.category);
            let rows = [];
            //this.getSummaryData('Result');
            // doc.text("W.E.F:", 143, 15);
            // doc.text(
            // this.datepipe.transform(this.currentDate.toString(), "MMM d, y"),
            // 160,
            // 15
            // );
            doc.setFontSize(18);
            doc.setTextColor(99, 29, 5);
            doc.text('\n' + element.category, 13, 25);
            doc.setFontSize(15);
            let count = 0;
            let grossAllArray: any[] = [];

            for (let leader in this.allMatchResults) {
                grossAllArray.push(this.allMatchResults[leader]);
            }
            grossAllArray.sort(this.ComparatorAllGrossSheet);
            this.sortAllGrossLeadersTie(grossAllArray);
            console.log(grossAllArray);

            for (let leader in grossAllArray) {
                count++;
                let temp = [
                    grossAllArray[leader].position,
                    grossAllArray[leader].name,
                    grossAllArray[leader].handicap,
                    grossAllArray[leader].clubName,
                    grossAllArray[leader].TotalGross4 != '' &&
                        grossAllArray[leader].TotalGross4 != undefined
                        ? grossAllArray[leader].TotalGross4
                        : '-',
                    grossAllArray[leader].TotalNet4 != '' &&
                        grossAllArray[leader].TotalNet4 != undefined
                        ? grossAllArray[leader].TotalNet4
                        : '-',
                    grossAllArray[leader].TotalGross3 != '' &&
                        grossAllArray[leader].TotalGross3 != undefined
                        ? grossAllArray[leader].TotalGross3
                        : '-',
                    grossAllArray[leader].TotalNet3 != '' &&
                        grossAllArray[leader].TotalNet3 != undefined
                        ? grossAllArray[leader].TotalNet3
                        : '-',
                    grossAllArray[leader].TotalGross2 != '' &&
                        grossAllArray[leader].TotalGross2 != undefined
                        ? grossAllArray[leader].TotalGross2
                        : '-',
                    grossAllArray[leader].TotalNet2 != '' &&
                        grossAllArray[leader].TotalNet2 != undefined
                        ? grossAllArray[leader].TotalNet2
                        : '-',
                    grossAllArray[leader].TotalGross1 != '' &&
                        grossAllArray[leader].TotalGross1 != undefined
                        ? grossAllArray[leader].TotalGross1
                        : '-',
                    grossAllArray[leader].TotalNet1 != '' &&
                        grossAllArray[leader].TotalNet1 != undefined
                        ? grossAllArray[leader].TotalNet1
                        : '-',
                    grossAllArray[leader].AllGrossPoints != '' &&
                        grossAllArray[leader].AllGrossPoints != undefined
                        ? grossAllArray[leader].AllGrossPoints
                        : '-',
                    grossAllArray[leader].AllNetPoints != '' &&
                        grossAllArray[leader].AllNetPoints != undefined
                        ? grossAllArray[leader].AllNetPoints
                        : '-',
                ];
                rows.push(temp);
            }

            // From HTML
            console.log(rows);
            // this.sortAllGrossLeadersTie(rows);
            // console.log(rows);
            doc.autoTable(col, rows, { startY: 35, theme: 'grid' });
            doc.addPage();

            // Open PDF document in new tab
        });

        doc.output('dataurlnewwindow');
        // Download PDF document
        //doc.save('flights.pdf');
    }
    populateActiveTournamentMembers() {
        for (let c of this.categories) {
            let nextRoundPlayers: any[] = [];
            let objLeader: Leader = new Leader(
                this.fullTournament,
                this.activeRound,
                this.fullTournament,
                c.category
            );

            let tournamentLeaders = objLeader.parseSubscriptionResponse();

            console.log(tournamentLeaders);

            if (tournamentLeaders) {
                tournamentLeaders = tournamentLeaders.filter((a) => {
                    return (
                        a['holes' + this.activeRound] == this.noOfHolesInCourse
                    );
                });

                nextRoundPlayers = tournamentLeaders.sort(
                    this.ComparatorAllGrossDesc
                );

                for (let p of nextRoundPlayers) {
                    let tm: TournamentMember = {
                        tournamentId: this.tournamentID,
                        playerId: p.playerId,
                        status: true,
                    };
                    this.activeTournamentMembers.push(tm);
                }
            }

            //console.log(this.activeTournamentMembers);

            this.markActiveTournamentMembers(this.activeTournamentMembers);
        }
    }

    markActiveTournamentMembers(tournamentMembers: TournamentMember[]) {
        this.facadeService.markActiveTournamentMembers(
            this.tournamentID,
            tournamentMembers
        );
    }

    getNextTeeBox(startingHoleOption: string, flight: number): number {
        if (startingHoleOption == '1_10') {
            console.log('In Function' + flight);

            if (flight !== 1 && flight % 2 === 0) return 10;
            else return 1;
        } else if (startingHoleOption == '10') {
            return 10;
        } else {
            return 1;
        }
    }

    getNextFlightTime(
        time: string,
        interval: number,
        startingHole: string,
        flight: number,
        teeBox: number
    ) {
        console.log(
            time +
            '<>' +
            interval +
            '<>' +
            startingHole +
            '<>' +
            flight +
            '<>' +
            teeBox
        );
        let flightTime: string = '00:00';

        try {
            let dateNow: Date = new Date(Constants.DEFAULT_DATE + ' ' + time);

            if (startingHole == '1_10') {
                if (teeBox === 1 && flight !== 1)
                    dateNow.setMinutes(dateNow.getMinutes() + interval);
            } else if (startingHole == '1') {
                if (flight % 2 == 0)
                    dateNow.setMinutes(dateNow.getMinutes() + interval);
                else {
                    dateNow.setMinutes(dateNow.getMinutes());
                }
            } else if (startingHole == '10') {
                if (flight % 2 == 0)
                    dateNow.setMinutes(dateNow.getMinutes() + interval);
                else {
                    dateNow.setMinutes(dateNow.getMinutes());
                }
            }

            console.log(dateNow);

            let h = dateNow.getHours();
            let m = dateNow.getMinutes();

            flightTime = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
        } catch {
            flightTime = '00:00';
        }

        return flightTime;
    }

    undoRound() {
        try {

            this.logger.log('Admin click on undo round btn', "info", this.activeRound.toString());
            this.logger.log('Round undo Dialog Box Open', "info", this.activeRound.toString());
            const dialogRef = this.dialog.open(DialogOverviewComponent, {
                width: '350px',
                data: 'Do you want to undo current round?',
            });

            dialogRef.afterClosed().subscribe(async (result) => {
                if (result) {
                    this.logger.log('Round undo sucessfully', "info", this.activeRound.toString());
                    let jObject = null;
                    console.log('====================================');
                    console.log(jObject);
                    console.log('====================================');
                    await this.facadeService.UndoTournamentRound(
                        this.tournamentID,
                        this.activeRound,
                        this.activeRound - 1,
                        jObject
                    );

                    window.location.reload();
                } else {
                    //console.log("cancel delete action");
                }
            });
        } catch (error) {
            this.logger.log('Round undo Failed', "error", error.toString());
        }
    }

    redirectToLeaderboard() {
        //this.router.navigate(['/leaderboard/' + this.tournamentID]);

        let tournament: string = '';

        if (this.fullTournament.prefix) tournament = this.fullTournament.prefix;
        else tournament = this.tournamentID;

        let url = this.router.createUrlTree(['/leaderboard', tournament]);
        window.open(url.toString(), '_blank');
    }
    redirectToScores() {
        this.router.navigate(['/matchplay/' + this.tournamentID]);
    }
    viewsignupform() {
        let url = this.router.createUrlTree([
            '/signUpForm/' + this.tournamentID,
        ]);
        window.open(url.toString(), '_blank');
    }

    redirectToflightManagement() {
        this.router.navigate(['/tournaments/manage/' + this.tournamentID]);
    }
    redirectToAttendance() {
        this.router.navigate(['/tournaments/attendance/' + this.tournamentID]);
    }
    redirectToHandicap() {
        this.router.navigate(['/tournaments/handicap/' + this.tournamentID]);
    }

    redirectToTournamentSetup() {
        this.router.navigate(['/tournaments/add/' + this.tournamentID]);
    }

    addTournamentPlayers() {
        this.router.navigate(['/tournaments/players/' + this.tournamentID]);
    }
    copy() {
        let selBox = document.createElement('textarea');

        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';

        selBox.value = this.leaderboardUrl;

        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();

        document.execCommand('copy');
        document.body.removeChild(selBox);
    }
    pop(s) {
        console.log(s.title);

        const dialogRef = this.dialog.open(DialogPlayingCategoryComponent, {
            data: {
                cat: s,
                tournament: this.tournamentID,
            },
        });
    }
    viewProfile(s) {
        console.log(s);

        this.router.navigate(['/players/view/' + s.id]);
    }

    ComparatorAllGross(a, b) {
        if (a['AllGrossUnder'] < b['AllGrossUnder']) return -1;
        if (a['AllGrossUnder'] > b['AllGrossUnder']) return 1;
        return 0;
    }
    ComparatorAllGrossSheet(a, b) {
        if (a.PlayingRound > b.PlayingRound) {
            return -1;
        }
        if (a.PlayingRound < b.PlayingRound) {
            return 1;
        }
        if (a.playerStatus < b.playerStatus) {
            return -1;
        }
        if (a.playerStatus > b.playerStatus) {
            return 1;
        }
        if (a['AllGrossUnder'] > b['AllGrossUnder']) return 1;
        if (a['AllGrossUnder'] < b['AllGrossUnder']) return -1;
        return 0;
    }
    ComparatorHandicap(a, b) {
        if (a.PlayerQL['handicap'] < b.PlayerQL['handicap']) return -1;
        if (a.PlayerQL['handicap'] > b.PlayerQL['handicap']) return 1;
        return 0;
    }

    ComparatorPosition(a, b) {
        if (a['position'] < b['position']) return -1;
        if (a['position'] > b['position']) return 1;
        return 0;
    }

    ComparatorPositionR1(a, b) {
        if (a['underR1'] < b['underR1']) return -1;
        if (a['underR1'] > b['underR1']) return 1;
        return 0;
    }

    ComparatorPositionR2(a, b) {
        if (a['underR2'] < b['underR2']) return -1;
        if (a['underR2'] > b['underR2']) return 1;
        return 0;
    }

    ComparatorPositionR3(a, b) {
        if (a['underR3'] < b['underR3']) return -1;
        if (a['underR3'] > b['underR3']) return 1;
        return 0;
    }

    ComparatorPositionR4(a, b) {
        if (a['underR4'] < b['underR4']) return -1;
        if (a['underR4'] > b['underR4']) return 1;
        return 0;
    }

    ComparatorAllGrossDesc(a, b) {
        if (a['AllGrossUnder'] > b['AllGrossUnder']) return -1;
        if (a['AllGrossUnder'] < b['AllGrossUnder']) return 1;
        return 0;
    }

    ComparatorAllNet(a, b) {
        if (a['AllNetUnder'] < b['AllNetUnder']) return -1;
        if (a['AllNetUnder'] > b['AllNetUnder']) return 1;
        return 0;
    }

    ComparatorAllNetDesc(a, b) {
        if (a['AllNetUnder'] > b['AllNetUnder']) return -1;
        if (a['AllNetUnder'] < b['AllNetUnder']) return 1;
        return 0;
    }

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }
    getHandicapAllocation(): string {
        let hcAllocation: string;

        if (this.dataFullTournament['TournamentQL'][0]['handicapAllocations'])
            hcAllocation =
                this.dataFullTournament['TournamentQL'][0][
                'handicapAllocations'
                ];
        else hcAllocation = handicapAllocation.AS_IS;

        return hcAllocation;
    }
    private async GrossData(category: any) {
        this.getSummaryData(category);

        console.log(this.allMatchResults);
        let grossAllArray: any[] = [];

        for (let leader in this.allMatchResults) {
            grossAllArray.push(this.allMatchResults[leader]);
        }
        grossAllArray.sort(this.ComparatorAllGrossSheet);
        this.sortAllGrossLeadersTie(grossAllArray);

        this.dataSourceTotalGross = new MatTableDataSource(grossAllArray);
        this.dataSourceTotalGross.paginator = this.paginator;
        this.dataSourceTotalGross.sort = this.sort;
    }

    getSummaryData(category) {
        this.allMatchResults = [];
        let flights = this.dataFullTournament['TournamentQL'][0].FlightsQL;
        let handicapAllocation: string = this.getHandicapAllocation();
        for (let flightData of flights) {
            let membersQLs: any = flightData.MembersQL;

            for (let membersQL of membersQLs) {
                let playerId: String = membersQL.playerId;

                let player: Player = membersQL.PlayerQL;
                if (category != 'Result') {
                    if (player.playerCategory !== category) continue;
                }

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
                let clubName = '';
                if (player.membership.length > 0)
                    clubName = player.membership[0].club.name;

                for (
                    let i = 0;
                    i < this.fullTournament.CourseQL.noOfHoles;
                    i++
                ) {
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
                let allStatus: any = this.memberStatusesQLs;
                let playerStatus: any;

                if (allStatus) {
                    playerStatus = allStatus.find(
                        (s) => s.playerId === playerId
                    );
                }

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
                    clubName: clubName ? General.getClubName(clubName) : '-',
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

                // this.grossLeaders.push(LeaderGross);
                // //console.log('Gross:' + this.grossLeaders);

                // this.grossAllLeaders.push(LeaderGross);
                // //console.log(this.grossAllLeaders);

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

                    clubName: clubName ? General.getClubName(clubName) : '-',
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

                // this.netLeaders.push(LeaderNet);
                // this.netAllLeaders.push(LeaderNet);
                // //console.log(this.netAllLeaders);

                this.calculateTotal(
                    LeaderGross,
                    LeaderNet,
                    flightData.flightRound
                );
            }
        }
    }
    private sortAllGrossLeadersTie(leaderGrossList: any[]) {
        //Collections.sort(grossLeaders);
        console.log(leaderGrossList);

        //console.log(leaderGrossList);
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

            // if (tied && firstCompleted && secondCompleted) {
            //     let noOfHoles = 9;
            //     while (tied && noOfHoles > 0) {
            //         //tied = this.getLastHolesTotal(noOfHoles, leaderCurrent.holeScores) == this.getLastHolesTotal(noOfHoles, leaderPrevious.holeScores);
            //         //currentHoleScore = this.getLastHolesTotal(noOfHoles, leaderCurrent.holeScores);
            //         //previousHoleScore = this.getLastHolesTotal(noOfHoles, leaderPrevious.holeScores);

            //         if (noOfHoles == 9)
            //             tied =
            //                 leaderCurrent.holeScoreLast9 ==
            //                 leaderPrevious.holeScoreLast9;
            //         else if (noOfHoles == 6)
            //             tied =
            //                 leaderCurrent.holeScoreLast6 ==
            //                 leaderPrevious.holeScoreLast6;
            //         else if (noOfHoles == 3)
            //             tied =
            //                 leaderCurrent.holeScoreLast3 ==
            //                 leaderPrevious.holeScoreLast3;
            //         else if (noOfHoles < 3)
            //             tied =
            //                 leaderCurrent.holeScoreLast1 ==
            //                 leaderPrevious.holeScoreLast1;

            //         //tied = currentHoleScore == previousHoleScore;

            //         if (noOfHoles > 3) {
            //             noOfHoles -= 3;
            //         } else {
            //             noOfHoles -= 2;
            //         }
            //     }
            // }
            ////console.log("tied-> " + tied);
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
    async NetData(category: any) {
        this.getSummaryData(category);
        this.allMatchResults.sort(this.ComparatorAllNet);
        let netAllArray: any[] = [];
        for (let leader in this.allMatchResults) {
            netAllArray.push(this.allMatchResults[leader]);
        }
        this.sortAllGrossLeadersTie(netAllArray);
        this.dataSourceTotalNET = new MatTableDataSource(netAllArray);
        this.dataSourceTotalNET.paginator = this.paginator;
        this.dataSourceTotalNET.sort = this.sort;
        this.showSummary = true;
    }
    async deleteTM(player: any) {
        console.log(player);
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '350px',
            data: 'Do you want to remove this player from Tournament?',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log("record deleted.");
                let result = this.facadeService.deleteTournamentMember(
                    this.tournamentID,
                    player.id
                );
                if (result) {
                    this.snackBar.open('Member has been deleted', 'x', {
                        duration: 3000,
                        panelClass: ['orange-snackbar'],
                    });
                    this.tournamentMember = this.tournamentMember.filter(
                        (a) => a.playerId !== player.id
                    );
                }
            } else {
                //console.log("cancel delete action");
            }
        });
    }
    async disqulifyTM(player: any) {
        console.log(player);
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '350px',
            data: 'Do you want to Disqualify this player from Tournament?',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log("record deleted.");
                let member: any = {
                    tournamentId: this.tournamentID,
                    playerId: player.id,
                    status: 'ic',
                };
                let result =
                    this.facadeService.insertTournamentMemberStatus(member);
                if (result) {
                    this.snackBar.open('Member has been disqualify', 'x', {
                        duration: 3000,
                        panelClass: ['orange-snackbar'],
                    });
                }
            } else {
                //console.log("cancel delete action");
            }
        });
    }
    public getLastHolesTotal(noOfHoles: number, holeScores: any[]): number {
        let total: number = 0;

        for (let i = holeScores.length - 1; i >= 0 && noOfHoles > 0; i--) {
            total += holeScores[i];
            noOfHoles--;
        }

        return total;
    }
    async getTournamentMembers() {
        try {
            this.logger.log('Getting Tournament Members', "info", this.tournamentID);

            let dataFullTournaments: any;
            if (this.dataFullTournament['TournamentQL'][0].leagueId == null) {
                dataFullTournaments = await this.facadeService.getTournamentMembers(
                    this.tournamentID
                );
                console.log(dataFullTournaments);
                this.flightNumber = this.fullTournament.FlightsQL.length + 1;
                this.tournamentMember = dataFullTournaments.TournamentMemberQL;
                this.tournamentMembers = dataFullTournaments.TournamentMemberQL;
                this.logger.log('Getting Tournament Members Succesfully', "info", this.tournamentID);
                this.dataSource = new MatTableDataSource(this.tournamentMember);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            } else {
                dataFullTournaments =
                    await this.facadeService.getTournamentsFlights(
                        this.tournamentID
                    );
                console.log(dataFullTournaments);
                this.logger.log('Getting Tournament Members Succesfully', "info", this.tournamentID);
                if (dataFullTournaments) {
                    for (let obj of dataFullTournaments['TournamentQL'][0]
                        .FlightManagerQLi) {
                        for (const iterator of obj.MembersQL) {
                            this.tournamentMember.push(iterator.PlayerQL);
                            this.tournamentMembers.push(iterator.PlayerQL);
                        }
                    }
                }
                this.flightNumber = this.fullTournament.FlightsQL.length + 1;
                // this.tournamentMember = dataFullTournaments.TournamentMemberQL;
                this.tournamentMembers = dataFullTournaments.TournamentMemberQL;

                this.dataSource = new MatTableDataSource(this.tournamentMember);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }
        } catch (error) {
            this.logger.log('Getting Tournaments Members Data Failed', "error", error.toString());
        }
    }

    private calculateTotal(leaderGross: any, leaderNet: any, round: number) {
        // let status: any = this.memberStatusesQLs.find(
        //   (s) => s.playerId === leaderGross.playerId
        // );

        // if (status && this.activeRound > 1) return false;

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
        this.allMatchResults[leaderGross.playerId]['clubName'] =
            leaderGross.clubName;
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
        this.allMatchResults[leaderGross.playerId]['completed' + round] =
            leaderGross.completed;

        // this.allMatchResults[leaderGross.playerId]["holeScoresGross" + round] =
        //   leaderGross.holeScores;
        // this.allMatchResults[leaderGross.playerId]["holeScoresNet" + round] =
        //   leaderNet.holeScores;

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

    applyMembersFilter(filterValue: string) {
        try {
            this.logger.log('Admin search in Tournament Members', "info", filterValue);
            if (filterValue == '') {
                this.tournamentMember = this.tournamentMembers;
                return;
            }
            filterValue = filterValue.toLowerCase();
            let players = [];
            if (filterValue.length >= 3) {
                for (let c of this.tournamentMembers) {
                    c['fullname'] =
                        c.player['firstName'] + ' ' + c.player['lastName'];
                    if (c['fullname'].toLowerCase().includes(filterValue)) {
                        players.push(c);
                    } else if (
                        c.player['membershipNumber'] &&
                        c.player['membershipNumber']
                            .toLowerCase()
                            .toString()
                            .includes(filterValue)
                    ) {
                        players.push(c);
                    } else if (
                        c.player['playerCategory'] &&
                        c.player['playerCategory']
                            .toLowerCase()
                            .toString()
                            .includes(filterValue)
                    ) {
                        players.push(c);
                    } else if (
                        c.player['email'] &&
                        c.player['email']
                            .toLowerCase()
                            .toString()
                            .includes(filterValue)
                    ) {
                        players.push(c);
                    }
                }
                console.log(players);

                this.tournamentMember = players;
                //console.log(this.player);
                // this.setDataSource(this.player);
            }
        } catch (error) {
            this.logger.log('Search in Tournament Members Failed', "error", error.toString());
        }
    }

    addPlayer() {
        const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log("record deleted.");
                console.log(result);
                // this.clubMembers.push(result);
                //console.log(this.clubMembers);
                // this.syncClubMembers();
            } else {
                //console.log("cancel delete action");
            }
        });
    }

    searchPlayer() {
        const dialogRef = this.dialog.open(DialogPlayerComponent, {
            width: '740px',
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result.length == 1) {
                //console.log("record deleted.");
                console.log(result);

                let founded = this.tournamentMembers.filter((a) => {
                    return a.player.id == result[0].player.id;
                });
                console.log(founded);

                if (founded.length == 0) {
                    let tournamentMember: TournamentMember[] = [];

                    let member: any = {
                        tournamentId: this.tournamentID,
                        playerId: result[0].player.id,
                        status: true,
                    };

                    this.saveMembers(member);
                    this.getTournamentMembers();
                } else {
                    this.snackBar.open(
                        'Player already exist in the list.',
                        'x',
                        {
                            duration: 5000,
                        }
                    );
                }
            } else if (result.length > 1) {
                result.forEach((element) => {
                    let founded = this.tournamentMembers.filter((a) => {
                        return a.player.id == result[0].player.id;
                    });
                    console.log(founded);

                    if (founded.length == 0) {
                        let tournamentMember: TournamentMember[] = [];

                        let member: any = {
                            tournamentId: this.tournamentID,
                            playerId: element.player.id,
                            status: true,
                        };

                        this.saveMembers(member);
                    } else {
                        this.snackBar.open(
                            'Player already exist in the list.',
                            'x',
                            {
                                duration: 5000,
                            }
                        );
                    }
                });
                this.getTournamentMembers();
            } else {
            }
        });
    }

    async saveMembers(tournamentMember: TournamentMember[]) {
        let result = <any>(
            await this.facadeService.insertTournamentMember(tournamentMember)
        );

        if (result) {
            this.snackBar.open('Tournament member have been added.', 'x', {
                duration: 5000,
            });
        }
    }
    movetoFlight(id) {
        this.mainSelected = ++this.mainSelected;
    }
    async playerList() {
        try {
            this.logger.log('Admin Click on Add New Member Btn on Members Tab', "info", this.tournamentID);

            let datas = await this.facadeService.getPlayersListForTournament(
                this.loggedInUser.adminClubId
            );
            let subtournamentID =
                this.dataFullTournament['SubTournamentQL'].length > 0
                    ? this.dataFullTournament['SubTournamentQL'][0].subTournamentId
                    : '';
            const dialogRef = this.dialog.open(DialogPlayerListComponent, {
                data: {
                    players: datas.player,
                    tournamentID: this.tournamentID,
                    subTournamentID: subtournamentID,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                console.log(result);
                const resultString = JSON.stringify(result);
                this.logger.log('Result From Add New Member Btn on Members Tab', "info", resultString);
                if (result) {
                    //console.log("record deleted.");
                    console.log(result);
                    this.getTournamentMembers();
                    // this.clubMembers.push(result);
                    // console.log(this.clubMembers);
                    // this.syncClubMembers();
                } else {
                    //console.log("cancel delete action");
                }
            });
        } catch (error) {
            this.logger.log('Getting Players To add on Tournament View Page Failed', "error", error.toString());
        }
    }
    async closeDrawer() {
        //let obj =new FlightManagementComponent(this.route, this.router,this.snackBar,this.dialog,null,this.facadeService,this.changeDetection);
        if (this.flightid) {
            //this._flightManagmentComponent.closedrawer(this.tournamentID);
            // obj.closedrawer(this.tournamentID)
            //obj.ngOnInit();
            // obj.changeRound(2);
        } else {
            //this._flightManagmentComponent.closedrawer(this.newFlightID);
            // obj.closedrawer(this.tournamentID)
        }
        this.matDrawer.close();
        this.flight = [];
        this.flightid = null;
        this.dataSourceFlightMembers = null;
    }
    selectedTee(event, flightId) {
        console.log(flightId);
        let target = event.source.selected._element.nativeElement;
        let selectedData = {
            value: event.value,
            text: target.innerText.trim(),
        };
        // console.log(this.roundFlights);
        if (this.flight) {
            let roundTeeId: any = General.getPlayersTe(selectedData.text);

            if (this.flight.id === flightId) {
                this.flight.tee = selectedData.value;
                this.flight.tee_id = roundTeeId.id;
            }
        }
    }
    onfligthNumberChange(event) {
        this.flight.flightNo = event;
    }
    onfligthTimeChange(event) {
        this.flight.time = event;
    }
    onfligthHoleChange(event) {
        this.flight.startingHole = event;
    }
    async getFlightId(id: string) {
        this.flightid = id;
        let SelectedFLight: any = [];
        let flightPlayers: any[] = [];
        this.getTournamentMembers();
        SelectedFLight = await this.facadeService.singleRoundFlightsQuery(
            this.flightid
        );
        this.flight = SelectedFLight.FlightsQL[0];
        this.flight.MembersQL.forEach((element) => {
            flightPlayers.push(element['PlayerQL']);
        });
        this.dataSourceFlightMembers = new MatTableDataSource(flightPlayers);
        this.dataSourceFlightMembers.sort = this.sort;
        console.log(this.flight);

        // console.log(this.flightid);
    }
    async getnewFlightId(id: string) {
        this.newFlightID = id;
        let SelectedFLight: any = [];
        let flightPlayers: any[] = [];
        this.getTournamentMembers();
        SelectedFLight = await this.facadeService.singleRoundFlightsQuery(
            this.newFlightID
        );
        this.flight = SelectedFLight.FlightsQL[0];
        this.flight.MembersQL.forEach((element) => {
            flightPlayers.push(element['PlayerQL']);
        });
        this.dataSourceFlightMembers = new MatTableDataSource(flightPlayers);
        this.dataSourceFlightMembers.sort = this.sort;
        console.log(this.flight);

        // console.log(this.flightid);
    }

    async removeFlightMembers(playerId) {
        console.log(playerId);
        let count = 0;
        // this.flight.MembersQL.forEach((element) => {
        //     if (element['PlayerQL'].id == playerId) {
        //         this.flight.MembersQL.splice(count, 1);
        //     }
        //     count++;
        // });
        let result = <any>(
            await this.facadeService.DeleteFlightMembers(
                this.flightid,
                playerId
            )
        );
        console.log(result);
        if (result) {
            this.snackBar.open('Flights members have been removed.', 'x', {
                duration: 5000,
            });
        }

        this.getFlightId(this.flightid);
    }
    getFlightTime(items: any) {
        let flightTime: string = '00:00';

        try {
            if (items.time) {
                let dateNow: Date = new Date(
                    Constants.DEFAULT_DATE + ' ' + items.time.substr(0, 5)
                );

                var h = dateNow.getHours();
                var m = dateNow.getMinutes();

                flightTime = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
            }
        } catch {
            flightTime = '00:00';
        }

        return flightTime;
    }
    createFlight(index: any) {
        this.flightRound = index;
        this.flight.startingHole = 1;
        this.flight.tee = 'AMATEURS';

        this.newFlightID = UniqueIdGenerator.generate();
    }
    async saveTournamentPlayer(player: any) {
        let flightMembersToSave: any[] = [];
        console.log(player);
        let roundTeeId: any = General.getPlayersTe(
            player.playerCategory ? player.playerCategory : 'AMATEURS'
        );

        let FM: any = {
            playerId: player.id,
            flightId: this.flightid ? this.flightid : this.newFlightID,
            attendance: true,
            playingTee: roundTeeId.result ? roundTeeId.result : 'AMATEURS',
            tee_id: roundTeeId.id,
        };
        flightMembersToSave.push(FM);
        let save: boolean;
        if (this.flightid) {
            save = <boolean>(
                await this.facadeService.saveFlightMembers(
                    this.flightid ? this.flightid : this.newFlightID,
                    flightMembersToSave
                )
            );
        } else {
            let flight: any = {
                id: this.newFlightID,
                tournamentId: this.tournamentID,
                courseId: this.fullTournament.CourseQL.id,
                adminId: this.fullTournament.adminId,
                courseHoleSets: this.fullTournament.courseHoleSets
                    ? this.fullTournament.courseHoleSets
                    : 3,
                flightNo: this.flightNumber,
                flightRound: this.flightRound,
                startingHole: this.flight.startingHole,
                tee: this.flight.length > 0 ? this.flight.tee : 'AMATEURS',
                tee_id: this.flight.length > 0 ? this.flight.tee_id : '1',
                date:
                    this.flight.length > 0
                        ? this.flight.date
                        : this.dataFullTournament['TournamentQL'][0].startDate,
                time: this.flight.time,
                ended: false,
            };
            await this.facadeService.SaveRoundFlight(flight);
            save = <boolean>(
                await this.facadeService.saveFlightMembers(
                    this.newFlightID,
                    flightMembersToSave
                )
            );
        }

        if (save && this.flightid) {
            this.getFlightId(this.flightid);
            this.snackBar.open(
                'Flights Member have been saved and updated successfully.',
                'x',
                {
                    duration: 5000,
                }
            );
        } else {
            this.getnewFlightId(this.newFlightID);
            this.snackBar.open(
                'Flights Member have been saved and updated successfully.',
                'x',
                {
                    duration: 5000,
                }
            );
        }
        // let result = <any>(
        //     await this.facadeService.saveFlightMembers(member)
        // );
        // this.getFlightId(this.flightid);
        // if (result) {
        //     this.snackBar.open('Tournament members have been saved.', 'x', {
        //         duration: 5000,
        //     });
        // }
    }
    async saveFlight() {
        console.log('flight saved');
        let flight: any;
        if (this.flightid) {
            flight = {
                id: this.flightid,
                tournamentId: this.tournamentID,
                courseId: this.fullTournament.CourseQL.id,
                adminId: this.flight.adminId,
                courseHoleSets:
                    this.flight.length > 0 ? this.flight.courseHoleSets : 3,
                flightNo: this.flight.flightNo,
                flightRound: this.flight.flightRound,
                startingHole: this.flight.startingHole,
                tee: this.flight.length > 0 ? this.flight.tee : 'AMATEURS',
                tee_id: this.flight.length > 0 ? this.flight.tee_id : '1',
                date:
                    this.flight.length > 0
                        ? this.flight.date
                        : this.dataFullTournament['TournamentQL'][0].startDate,
                time: this.flight.time,
                ended: false,
            };
        } else {
            flight = {
                id: this.newFlightID,
                tournamentId: this.tournamentID,
                courseId: this.fullTournament.CourseQL.id,
                adminId: this.fullTournament.adminId,
                courseHoleSets: this.fullTournament.courseHoleSets
                    ? this.fullTournament.courseHoleSets
                    : 3,
                flightNo: this.flightNumber,
                flightRound: this.flightRound,
                startingHole: this.flight.startingHole,
                tee: this.flight.length > 0 ? this.flight.tee : 'AMATEURS',
                tee_id: this.flight.length > 0 ? this.flight.tee_id : '1',
                date:
                    this.flight.length > 0
                        ? this.flight.date
                        : this.dataFullTournament['TournamentQL'][0].startDate,
                time: this.flight.time,
                ended: false,
            };
        }
        let save = <boolean>await this.facadeService.SaveRoundFlight(flight);
        if (save) {
            this.getFlightId(this.flightid);
            this.snackBar.open(
                'Flights have been saved and updated successfully.',
                'x',
                {
                    duration: 5000,
                }
            );
        }
        // }
    }
}
