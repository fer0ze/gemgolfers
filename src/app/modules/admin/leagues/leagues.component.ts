import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { FacadeService } from 'app/shared/services/facade.service';
import { DatePipe } from '@angular/common';
import { Club } from 'app/shared/models/club.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApexOptions } from 'ng-apexcharts';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';
@Component({
    selector: 'app-leagues',
    templateUrl: './leagues.component.html',
    styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent implements OnInit {
    clubs: any[] = [];
    showLeaderBoards: boolean = false;
    _series: any = [];
    selectedId: any = null;
    leaderBoards: any[] = [];
    dataSource: MatTableDataSource<any>;
    displayedColumns = [
        'id',
        'name',
        'date',
        'members',
        'tournament',
        'details',
    ];
    loggedInuser: any;
    chartBudgetDistribution: ApexOptions = {};
    chartGithubIssues: ApexOptions = {};
    public barChartLabels: string[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    showdata: Promise<boolean>;
    constructor(
        private datePipe: DatePipe,
        private location: Router,
        private facadeService: FacadeService,
        private route: ActivatedRoute,
        private apollo: Apollo,
        private _localStorage: LocalStorageService
    ) { }

    ngOnInit(): void {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        this.fecthData();
    }

    async fecthData() {

        let dataMembers: any[] = [];
        let dataTournaments: any[] = [];
        let clubName: any[] = [];
        let clubs: any;
        console.log(this.loggedInuser);
        if (this.loggedInuser.userRole == 1) {
            clubs = await this.facadeService.getLeagues();
        } else if (this.loggedInuser.userRole == 2) {
            clubs = await this.facadeService.getLeaguesByClub(this.loggedInuser.adminClubId);
        }
        // console.log(clubs.league);
        this.clubs = clubs.league;
        if (this.clubs.length == 0) {
            this.showLeaderBoards = true;
        }
        this.dataSource = new MatTableDataSource(clubs.league);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        for (let obj of this.clubs) {
            if (obj['members'].length > 0) {
                this.barChartLabels.push(obj.name);
                dataMembers.push(obj['members'].length);
                dataTournaments.push(obj['tournaments'].length);
            }
        }
        this._series['0'] = [
            {
                data: dataMembers,
                name: 'Members',
                type: 'line',
            },
            {
                data: dataMembers,
                name: 'Members',
                type: 'column',
            },

            {
                data: dataTournaments,
                name: 'Tournaments',
                type: 'column',
            },
        ];
        this.chart();
        this.showdata = Promise.resolve(true);
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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
            colors: ['#AF6F0B', '#121212', '#AC1500'],
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
        //     series: this._HolesSetsseries,
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
        //         categories: this.courseholesets,
        //     },
        //     yaxis: {
        //         max: (max: number): number =>
        //             parseInt((max + 10).toFixed(0), 10),
        //         tickAmount: 7,
        //     },
        // };
    }

    toggleDetails(productId: string): void {
        this.showLeaderBoards = true;
        if (this.selectedId && this.selectedId === productId) {
            this.showLeaderBoards = false;
            return;
        }

        this.leaderBoards = this.clubs.find((a) => {
            return a.id == productId;
        });
        this.showLeaderBoards = true;
    }
}
