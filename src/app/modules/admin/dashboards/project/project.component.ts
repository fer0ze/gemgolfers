import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { TournamentsService } from 'app/shared/services/tournaments.service';
import { FacadeService } from 'app/shared/services/facade.service';
import {
    Constants,
    General,
    labels,
    labelsPlayers,
    UniqueIdGenerator,
} from 'app/shared/classes/general';
import { trigger } from '@angular/animations';
import { Player } from 'app/shared/models/player.model';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddTourMainComponent } from '../../dialogs/dialog-add-tour-main/dialog-add-tour-main.component';

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    tournamentCounts: any;
    flightCounts: any;
    flightCountsCal: any = 0;
    membersCountsCal: any = 0;
    flightCountsNotCal: any = 0;
    amateurCount: any = 0;
    seniorCount: any = 0;
    ladiesCount: any = 0;
    vateranCount: any = 0;
    yesterdayFlightCounts: any = 20;
    playerAddedTodayCounts: any = 2;
    playerCounts: any = 0;
    showdata: Promise<boolean>;
    loading: boolean = false;
    _labels: any = labels;
    _labelsPlayers: any = labelsPlayers;
    _series: any = [];
    _overview: any = [];
    _seriesPlayers: any = [];
    _overviewPlayers: any = [];
    selectedProject: string = 'ACME Corp. Backend App';
    loggedInuser: Player;
    newRounds: any = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    clubLogo: string;
    tournaments: any;

    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        public dialog: MatDialog,
        private _facadeService: FacadeService,
        private _datePipe: DatePipe, private _localStorage: LocalStorageService, private logger: LogsService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.loggedInuser.adminClubId=localStorage.getItem('adminClubID');
        try {
            this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
            let clubInfo: any =
                this.loggedInuser.membership.length > 0
                    ? this.loggedInuser.membership[0].club
                    : null;

            this.clubLogo = clubInfo && clubInfo.logo ? clubInfo.logo : 'e2esp.png';
            let currentDate = new Date();
            let tournamentCounts;
            let flightCounts;
            let playerCounts;
            let dataPlayers: any;
            let players: any;
            let getall: any;

            //this.showdata = Promise.resolve(true);
            this.loading = false;
            this._projectService.data$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res) => {
                    let getall = res.data;
                    //console.log(getall);

                    if (this.loggedInuser.userRole == 2 || this.loggedInuser.userRole == 1) {

                        this.tournamentCounts = getall.TournamentCount.aggregate.count;
                        if (this.tournamentCounts > 6) {
                            this.tournaments = getall.TournamentQL.splice(0, 6);
                        } else {
                            this.tournaments = getall.TournamentQL;
                        }

                        //console.log(this.tournamentCounts);

                        this.flightCounts = getall.Count.aggregate.count;
                        //console.log(this.flightCounts);

                        this.playerCounts = getall.AggregateQL.aggregate.totalCount;
                        //console.log(this.playerCounts);
                        //console.log('a');

                        //console.log(res.data);

                        let myData: any[] = [];
                        let prevDate = null;
                        let memCounter = 0;
                        let totalFlights = 0;

                        let data = getall.TournamentsQLs.sort(this.ComparatorDate);
                        //let data = dataPlayers.TournamentsQL;
                        let i = 0;
                        let distinctMembers = new Set();
                        let distinctCategory = new Set();
                        const categoryCounts = {
                            'Amateurs': 0,
                            'Senior Amateurs': 0,
                            'Ladies': 0,
                            'Veterans': 0, // Add all possible categories
                            'others': 0, // Add all possible categories
                        }
                        this._labels = [];
                        for (let stats of data) {
                            if (stats.ended) {
                                this.flightCountsCal++;
                            }
                            if (stats.date == prevDate) {
                                memCounter =
                                    memCounter + (stats ? stats.MembersQL.length : 0);
                                totalFlights = totalFlights + 1;
                                for (let member of stats.MembersQL) {

                                    if (!distinctMembers.has(member.playerId)) {
                                        distinctMembers.add(member.playerId);
                                        if (categoryCounts[member.player.playerCategory] !== undefined) {
                                            categoryCounts[member.player.playerCategory]++;
                                        } else {
                                            categoryCounts['others']++;
                                        }
                                    }
                                }
                                myData[myData.length - 1].membersCount = memCounter;
                                myData[myData.length - 1].totalFlights = totalFlights;
                                prevDate = stats.date;
                            } else {
                                memCounter = 0;
                                totalFlights = 0;
                                memCounter =
                                    memCounter + (stats ? stats.MembersQL.length : 0);
                                totalFlights = totalFlights + 1;
                                for (let member of stats.MembersQL) {
                                    distinctMembers.add(member.playerId);
                                    if (categoryCounts[member.player.playerCategory] !== undefined) {
                                        categoryCounts[member.player.playerCategory]++;
                                    } else {
                                        categoryCounts['others']++;
                                    }
                                }
                                let obj = {
                                    date: stats.date,
                                    membersCount: memCounter,
                                    totalFlights: totalFlights,
                                };

                                myData.push(obj);
                                prevDate = stats.date;
                            }
                        }
                        // //console.log(distinctMembers.size);
                        // //console.log(distinctCategory);
                        // //console.log(categoryCounts);

                        // //console.log(myData);
                        this.membersCountsCal = distinctMembers.size;
                        let dataMembers: any[] = [];
                        let dataFlight: any[] = [];
                        for (let obj of myData) {
                            this._labels.push(General.getdate(obj.date));
                            dataMembers.push(obj.membersCount);
                            dataFlight.push(obj.totalFlights);
                        }
                        this._series = [
                            {
                                data: dataMembers,
                                name: 'Members',
                                type: 'line',
                            },
                            {
                                data: dataFlight,
                                name: 'Rounds',
                                type: 'column',
                            },
                        ];

                        // this.flightCountsNotCal =
                        //     getall.TournamentsQLs.length - this.flightCountsCal;
                        // //console.log(this._overview);

                        this._overview = {
                            newIssues: getall.TournamentsQLs.length,
                            closedIssues: this.membersCountsCal,
                            fixed: categoryCounts.Amateurs,
                            wontfix: categoryCounts['Senior Amateurs'],
                            reopened: categoryCounts.Ladies,
                            needstriage: categoryCounts.Veterans,
                        }
                        // //console.log(players);
                        if (this.loggedInuser.userRole == 1) {
                            this._seriesPlayers['all'] = [
                                getall.Amateurs.aggregate['count'],

                                getall.Senior_Amateurs.aggregate['count'],

                                getall.Veterans.aggregate['count'],

                                getall.Ladies.aggregate['count'],
                            ];
                        } else {
                            this._seriesPlayers['all'] = [
                                getall.club[0].Amateurs.aggregate['count'],

                                getall.club[0].Senior_Amateurs.aggregate['count'],

                                getall.club[0].Veterans.aggregate['count'],

                                getall.club[0].Ladies.aggregate['count'],
                            ];
                        }
                    } else if (this.loggedInuser.userRole == 4 && getall.tour.length > 0) {

                        // this.tournamentCounts = getall.TournamentsQLs.length;
                        const membersCatCounts = {
                            'Amateurs': 0,
                            'Senior Amateurs': 0,
                            'Ladies': 0,
                            'Veterans': 0, // Add all possible categories
                            'others': 0, // Add all possible categories
                        }
                        this.tournamentCounts = 0;
                        let latestTournament = [];
                        this.tournamentCounts = getall.TournamentCount.aggregate.count;
                        for (let tour of getall.tour) {
                            for (let tournament of tour.tournaments) {
                                latestTournament.push(tournament);
                            }
                            this.playerCounts += tour.members.length;
                            for (let member of tour.members) {

                                if (member.player && member.player.playerCategory) {
                                    // Increment the count for the corresponding player category
                                    membersCatCounts[member.player.playerCategory]++;
                                }

                            }

                        }
                        if (this.tournamentCounts > 6) {
                            this.tournaments = latestTournament.splice(0, 6);
                        } else {
                            this.tournaments = latestTournament;
                        }
                        this.flightCounts = getall.tour.length;
                        let myData: any[] = [];
                        let prevDate = null;
                        let memCounter = 0;
                        let totalFlights = 0;

                        let data = getall.TournamentsQLs.sort(this.ComparatorDate);
                        //let data = dataPlayers.TournamentsQL;
                        let i = 0;
                        let distinctMembers = new Set();
                        let distinctCategory = new Set();
                        const categoryCounts = {
                            'Amateurs': 0,
                            'Senior Amateurs': 0,
                            'Ladies': 0,
                            'Veterans': 0, // Add all possible categories
                            'others': 0, // Add all possible categories
                        }
                        this._labels = [];
                        for (let stats of data) {
                            if (stats.startDate == prevDate) {
                                memCounter =
                                    memCounter + (stats ? stats.MembersQL.length : 0);
                                totalFlights = totalFlights + 1;
                                for (let member of stats.MembersQL) {

                                    if (!distinctMembers.has(member.playerId)) {
                                        distinctMembers.add(member.playerId);
                                        if (categoryCounts[member.player.playerCategory] !== undefined) {
                                            categoryCounts[member.player.playerCategory]++;
                                        } else {
                                            categoryCounts['others']++;
                                        }
                                    }
                                }
                                myData[myData.length - 1].membersCount = memCounter;
                                myData[myData.length - 1].totalFlights = totalFlights;
                                prevDate = stats.v;
                            } else {
                                memCounter = 0;
                                totalFlights = 0;
                                memCounter =
                                    memCounter + (stats ? stats.MembersQL.length : 0);
                                totalFlights = totalFlights + 1;
                                for (let member of stats.MembersQL) {
                                    distinctMembers.add(member.playerId);
                                    if (categoryCounts[member.player.playerCategory] !== undefined) {
                                        categoryCounts[member.player.playerCategory]++;
                                    } else {
                                        categoryCounts['others']++;
                                    }
                                }
                                let obj = {
                                    date: stats.startDate,
                                    membersCount: memCounter,
                                    totalFlights: totalFlights,
                                };

                                myData.push(obj);
                                prevDate = stats.startDate;
                            }
                        }
                        // //console.log(distinctMembers.size);
                        // //console.log(distinctCategory);
                        // //console.log(categoryCounts);

                        // //console.log(myData);
                        this.membersCountsCal = distinctMembers.size;
                        let dataMembers: any[] = [];
                        let dataFlight: any[] = [];
                        for (let obj of myData) {
                            this._labels.push(General.getdate(obj.date));
                            dataMembers.push(obj.membersCount);
                            dataFlight.push(obj.totalFlights);
                        }
                        this._series = [
                            {
                                data: dataMembers,
                                name: 'Members',
                                type: 'line',
                            },
                            {
                                data: dataFlight,
                                name: 'Rounds',
                                type: 'column',
                            },
                        ];

                        this._overview = {
                            newIssues: getall.TournamentsQLs.length,
                            closedIssues: this.membersCountsCal,
                            fixed: categoryCounts.Amateurs,
                            wontfix: categoryCounts['Senior Amateurs'],
                            reopened: categoryCounts.Ladies,
                            needstriage: categoryCounts.Veterans,
                        }
                        // //console.log(players);
                        this._seriesPlayers['all'] = [
                            membersCatCounts.Amateurs,
                            membersCatCounts['Senior Amateurs'],
                            membersCatCounts.Veterans,
                            membersCatCounts.Ladies,
                            membersCatCounts.others,

                        ];
                    }

                    // Prepare the chart data
                    this._prepareChartData();
                    this.loading = true;
                });
        } catch (error) {
            this.logger.log('Getting Dashboard Data Failed', "error", error.toString());
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngAfterViewInit(): void {
        this.loading = true;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    addNewRound() {
        this._router.navigate(['/dailyRounds/add-daily-rounds']);
    }
    addNewPlayer() {
        this._router.navigate([
            '/players/view/' + UniqueIdGenerator.generate(),
        ]);
    }

    ComparatorDate(a, b) {
        if (a['date'] < b['date']) return -1;
        if (a['date'] > b['date']) return 1;
        return 0;
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // Github issues
        //console.log('b');

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
            colors: ['#64748B', '#94A3B8'],
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
            labels: this._labels,
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

        //Task distribution
        this.chartTaskDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'polarArea',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            labels: this._labelsPlayers,
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings: {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series: this._seriesPlayers,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: 2,
            },
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo: 'dark',
                },
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };
    }
    async addnewTour() {
        const dialogRef = this.dialog.open(DialogAddTourMainComponent);
        dialogRef.afterClosed().subscribe(async (result) => {
          //console.log(result);
          if (result) {
            let tour = {
              id: UniqueIdGenerator.generate(),
              adminId: this.loggedInuser.id,
              name: result.title,
              logo: null,
              dateCreated:new Date().toISOString(),
              startDate:result.startDate,
              endDate:result.endDate,
            }
            this._facadeService.addTour(tour, result.file).subscribe((result) => {
              //console.log(result);
              if (result) {
                
              }
            })
    
          }
    
        })
    
      }
}
