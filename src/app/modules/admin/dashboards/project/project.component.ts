import {
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
    labels,
    labelsPlayers,
    UniqueIdGenerator,
} from 'app/shared/classes/general';
import { trigger } from '@angular/animations';
import { Player } from 'app/shared/models/player.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit, OnDestroy {
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
        private _facadeService: FacadeService,
        private _datePipe: DatePipe
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit() {
        // this.loggedInuser.adminClubId=localStorage.getItem('adminClubID');
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        let clubInfo: any =
            this.loggedInuser.membership.length > 0
                ? this.loggedInuser.membership[0].club
                : null;

        this.clubLogo = clubInfo && clubInfo.logo ? clubInfo.logo : 'e2esp.png';
        // Attach SVG fill fixer to all ApexCharts
        this.showdata = Promise.resolve(true);
        
        console.log(this.showdata);

        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
        //this._prepareChartData();
        let currentDate = new Date();
        let lastWeekSunday = this.lastWeekSunday();
        let lastWeekMonday = this.lastWeekMonday();
        //this.showdata = Promise.resolve(true);
        this.fetchdata();
        //  this.getDailyRounds(lastWeekSunday, lastWeekMonday);
        //  this.getAllPlayers();
        // this._projectService.data$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((data) => {
        //         // Store the data
        //         this.data = data;
        //         console.log(this.data);
        //     });
        this.showdata = Promise.resolve(true);
        this.loading = true;
        console.log(this.showdata);

        // Get the data
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        // Github issues
        console.log('b');

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

        // Budget distribution
        // this.chartBudgetDistribution = {
        //     chart: {
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'radar',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#818CF8'],
        //     dataLabels: {
        //         enabled: true,
        //         formatter: (val: number): string | number => `${val}%`,
        //         textAnchor: 'start',
        //         style: {
        //             fontSize: '13px',
        //             fontWeight: 500,
        //         },
        //         background: {
        //             borderWidth: 0,
        //             padding: 4,
        //         },
        //         offsetY: -15,
        //     },
        //     markers: {
        //         strokeColors: '#818CF8',
        //         strokeWidth: 4,
        //     },
        //     plotOptions: {
        //         radar: {
        //             polygons: {
        //                 strokeColors: 'var(--fuse-border)',
        //                 connectorColors: 'var(--fuse-border)',
        //             },
        //         },
        //     },
        //     series: this.data.budgetDistribution.series,
        //     stroke: {
        //         width: 2,
        //     },
        //     tooltip: {
        //         theme: 'dark',
        //         y: {
        //             formatter: (val: number): string => `${val}%`,
        //         },
        //     },
        //     xaxis: {
        //         labels: {
        //             show: true,
        //             style: {
        //                 fontSize: '12px',
        //                 fontWeight: '500',
        //             },
        //         },
        //         categories: this.data.budgetDistribution.categories,
        //     },
        //     yaxis: {
        //         max: (max: number): number =>
        //             parseInt((max + 10).toFixed(0), 10),
        //         tickAmount: 7,
        //     },
        // };

        // Weekly expenses
        // this.chartWeeklyExpenses = {
        //     chart: {
        //         animations: {
        //             enabled: false,
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'line',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#22D3EE'],
        //     series: this.data.weeklyExpenses.series,
        //     stroke: {
        //         curve: 'smooth',
        //     },
        //     tooltip: {
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         type: 'category',
        //         categories: this.data.weeklyExpenses.labels,
        //     },
        //     yaxis: {
        //         labels: {
        //             formatter: (val): string => `$${val}`,
        //         },
        //     },
        // };

        // Monthly expenses
        // this.chartMonthlyExpenses = {
        //     chart: {
        //         animations: {
        //             enabled: false,
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'line',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#4ADE80'],
        //     series: this.data.monthlyExpenses.series,
        //     stroke: {
        //         curve: 'smooth',
        //     },
        //     tooltip: {
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         type: 'category',
        //         categories: this.data.monthlyExpenses.labels,
        //     },
        //     yaxis: {
        //         labels: {
        //             formatter: (val): string => `$${val}`,
        //         },
        //     },
        // };

        // Yearly expenses
        // this.chartYearlyExpenses = {
        //     chart: {
        //         animations: {
        //             enabled: false,
        //         },
        //         fontFamily: 'inherit',
        //         foreColor: 'inherit',
        //         height: '100%',
        //         type: 'line',
        //         sparkline: {
        //             enabled: true,
        //         },
        //     },
        //     colors: ['#FB7185'],
        //     series: this.data.yearlyExpenses.series,
        //     stroke: {
        //         curve: 'smooth',
        //     },
        //     tooltip: {
        //         theme: 'dark',
        //     },
        //     xaxis: {
        //         type: 'category',
        //         categories: this.data.yearlyExpenses.labels,
        //     },
        //     yaxis: {
        //         labels: {
        //             formatter: (val): string => `$${val}`,
        //         },
        //     },
        // };
    }

    addNewRound() {
        this._router.navigate(['/dailyRounds/add-daily-rounds']);
    }
    addNewPlayer() {
        this._router.navigate([
            '/players/view/' + UniqueIdGenerator.generate(),
        ]);
    }
    private async fetchdata() {
        // Get the Tournaments Count
        this.showdata = Promise.resolve(false);
        let tournamentCounts;
        let flightCounts;
        let playerCounts;
        let dataPlayers: any;
        let players: any;
        let getall: any;
        let lastWeekSunday = this.lastWeekSunday();
        let lastWeekMonday = this.lastWeekMonday();
        if (this.loggedInuser.userRole == 1) {
            // tournamentCounts =
            //     await this._facadeService.getTournamentCountsByClubAll();
            // //Get the Flights Count
            // flightCounts = await this._facadeService.getTotalFlightsAll();
            // playerCounts = await this._facadeService.getTotalPlayersAll();
            // dataPlayers =
            //     await this._facadeService.getDailyRoundsSingleDashboardAll(
            //         this._datePipe.transform(
            //             lastWeekSunday.toString(),
            //             'yyyy-MM-dd'
            //         ),
            //         this._datePipe.transform(
            //             lastWeekMonday.toString(),
            //             'yyyy-MM-dd'
            //         )
            //     );
            // players =
            //     await this._facadeService.getClubMemberAggregateByCategroyDashBoardAll();
            getall = await this._facadeService.getAllAdmin(
                this._datePipe.transform(
                    lastWeekSunday.toString(),
                    'yyyy-MM-dd'
                ),
                this._datePipe.transform(
                    lastWeekMonday.toString(),
                    'yyyy-MM-dd'
                )
            );
        } else {
            // tournamentCounts =
            //     await this._facadeService.getTournamentCountsByClub(
            //         this.loggedInuser.adminClubId
            //     );
            // //Get the Flights Count
            // flightCounts = await this._facadeService.getTotalFlights(
            //     this.loggedInuser.adminClubId
            // );
            // // Get the Flights Count
            // playerCounts = await this._facadeService.getTotalPlayers(
            //     this.loggedInuser.adminClubId
            // );
            // dataPlayers =
            //     await this._facadeService.getDailyRoundsSingleDashboard(
            //         this.loggedInuser.adminClubId,
            //         this._datePipe.transform(
            //             lastWeekSunday.toString(),
            //             'yyyy-MM-dd'
            //         ),
            //         this._datePipe.transform(
            //             lastWeekMonday.toString(),
            //             'yyyy-MM-dd'
            //         )
            //     );

            // players =
            //     await this._facadeService.getClubMemberAggregateByCategroyDashBoard(
            //         this.loggedInuser.adminClubId
            //     );
            getall = await this._facadeService.getAll(
                this.loggedInuser.adminClubId,
                this._datePipe.transform(
                    lastWeekSunday.toString(),
                    'yyyy-MM-dd'
                ),
                this._datePipe.transform(
                    lastWeekMonday.toString(),
                    'yyyy-MM-dd'
                )
            );
        }

        this.tournamentCounts = getall.TournamentQL.length;
        if (this.tournamentCounts > 6) {
            this.tournaments = getall.TournamentQL.splice(0, 6);
        } else {
            this.tournaments = getall.TournamentQL;
        }

        console.log(this.tournamentCounts);

        this.flightCounts = getall.Count.aggregate.count;
        console.log(this.flightCounts);

        this.playerCounts = getall.AggregateQL.aggregate.totalCount;
        console.log(this.playerCounts);
        console.log('a');

        console.log(dataPlayers);

        let myData: any[] = [];
        let prevDate = null;
        let memCounter = 0;
        let totalFlights = 0;

        let data = getall.TournamentsQLs.sort(this.ComparatorDate);
        //let data = dataPlayers.TournamentsQL;
        let i = 0;
        for (let stats of data) {
            if (stats.FlightsQL.length > 0 && stats.FlightsQL[0].ended) {
                this.flightCountsCal++;
            }
            if (stats.startDate == prevDate) {
                memCounter =
                    memCounter +
                    (stats.FlightsQL.length > 0 && stats.FlightsQL[0]
                        ? stats.FlightsQL[0].MembersQL.length
                        : 0);
                totalFlights = totalFlights + stats.FlightsQL.length;

                myData[myData.length - 1].membersCount = memCounter;
                myData[myData.length - 1].totalFlights = totalFlights;
                prevDate = stats.startDate;
            } else {
                memCounter = 0;
                totalFlights = 0;
                memCounter =
                    memCounter +
                    (stats.FlightsQL.length > 0 && stats.FlightsQL[0]
                        ? stats.FlightsQL[0].MembersQL.length
                        : 0);
                totalFlights = totalFlights + stats.FlightsQL.length;

                let obj = {
                    date: stats.startDate,
                    membersCount: memCounter,
                    totalFlights: totalFlights,
                };

                myData.push(obj);
                prevDate = stats.startDate;
            }
        }

        console.log(myData);
        let dataMembers: any[] = [];
        let dataFlight: any[] = [];
        for (let obj of myData) {
            this.membersCountsCal += obj.membersCount;
            dataMembers.push(obj.membersCount);
            dataFlight.push(obj.totalFlights);
        }
        this._series['last-week'] = [
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

        this.flightCountsNotCal =
            getall.TournamentsQLs.length - this.flightCountsCal;
        console.log(this._overview);

        this._overview['last-week'] = [
            {
                newIssues: getall.TournamentsQLs.length,
                closedIssues: this.membersCountsCal,
                fixed: this.flightCountsCal,
                wontfix: this.flightCountsNotCal,
                reopened: '20',
                needstriage: '36',
            },
        ];

        this._prepareChartData();

        console.log(players);
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

        console.log(this._seriesPlayers);
        this.showdata = Promise.resolve(true);
    }

    ComparatorDate(a, b) {
        if (a['startDate'] < b['startDate']) return -1;
        if (a['startDate'] > b['startDate']) return 1;
        return 0;
    }
    lastWeekMonday() {
        //let date = new Date();
        //return new Date(date.setDate(date.getDate() - 8));
        let date = new Date();
        let day = date.getDay();
        let prevMonday = new Date();
        if (date.getDay() == 0) {
            prevMonday.setDate(date.getDate() - 7);
        } else {
            prevMonday.setDate(date.getDate() - (day + 6));
        }

        return prevMonday;
    }
    lastWeekSunday() {
        let date = new Date();
        let day = date.getDay();
        let prevSunday = new Date();
        if (date.getDay() == 7) {
            prevSunday.setDate(date.getDate() - 7);
        } else {
            prevSunday.setDate(date.getDate() - day);
        }

        return prevSunday;
    }
}
