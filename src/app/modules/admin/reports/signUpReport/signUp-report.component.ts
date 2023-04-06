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
import { of } from 'rxjs';
@Component({
    selector: 'app-signUp-report',
    templateUrl: './signUp-report.component.html',
    styleUrls: ['./signUp-report.component.scss'],
})
export class SignUpReportComponent implements OnInit {
    chartVisitors: ApexOptions;
    showdata: Promise<boolean>;
    chartConversions: ApexOptions;
    chartImpressions: ApexOptions;
    chartVisits: ApexOptions;
    chartVisitorsVsPageViews: ApexOptions;
    chartNewVsReturning: ApexOptions;
    chartGender: ApexOptions;
    chartAge: ApexOptions;
    chartLanguage: ApexOptions;
    data: any;
    male: number = 0;
    female: number = 0;
    series: any[] = [];
    seriesA: any[] = [];
    seriesB: any[] = [];
    seriesC: any[] = [];
    seriesD: any[] = [];
    _seriesE: any[] = [];
    labelsE: any[] = [];
    dataMembers: any[] = [];
    dataMembersA: any[] = [];
    dataMembersB: any[] = [];
    dataMembersC: any[] = [];
    dataMembersE: any[] = [];
    Players: any = [];
    thisMonth: number = 0;
    MonthLabels: any[] = ['01 - 08', '09 - 16', '17 - 24'];
    genderLabels: any[] = ['Male', 'Female'];
    lastMonth: number = 0;
    clubPlayers: number = 0;
    mobilePlayers: number = 0;
    SecondLastMonth: number = 0;
    dataSource: MatTableDataSource<any>;
    displayedColumns = ['id', 'name', 'date', 'email', 'phone', 'flights'];
    monthName = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        private datePipe: DatePipe,
        private location: Router,
        private facadeService: FacadeService,
        private route: ActivatedRoute,
        private apollo: Apollo
    ) {}

    ngOnInit(): void {
        this.fecthData();
        this.showdata = Promise.resolve(true);
    }

    async fecthData() {
        // this.showdata = Promise.resolve(false);
        of(this.Players)
            .pipe()
            .subscribe(
                async (data) => {
                    data = await this.facadeService.getPlayersListReport();
                    this.data = data;
                    console.log(data);
                    let d = new Date();
                    d.setDate(1);
                    for (let i = 0; i <= 18; i++) {
                        console.log(
                            this.monthName[d.getMonth()] + ' ' + d.getFullYear()
                        );
                        this.labelsE.push(
                            this.monthName[d.getMonth()] + ' ' + d.getFullYear()
                        );
                        d.setMonth(d.getMonth() - 1);
                    }
                    console.log(this.labelsE);

                    this.sorts();
                    this.series[0] = [
                        {
                            data: this.dataMembers,
                            name: 'New Users',
                        },
                    ];
                    this.seriesA = [
                        {
                            data: this.dataMembersA,
                            name: 'Users',
                        },
                    ];
                    this.seriesB = [
                        {
                            data: this.dataMembersB,
                            name: 'Users',
                        },
                    ];
                    this.seriesC = [
                        {
                            data: this.dataMembersC,
                            name: 'Users',
                        },
                    ];
                    this.seriesD = [this.male, this.female];

                    this._seriesE[0] = [
                        {
                            data: this.dataMembersE,
                            name: 'Players',
                            type: 'line',
                        },
                        {
                            data: this.dataMembersE,
                            name: 'Players',
                            type: 'column',
                        },
                    ];

                    this._prepareChartData();
                },
                (error) => console.log('error')
            );
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
    sorts() {
        let rows = [];
        let myData: any[] = [];
        let memCounter = 0;
        let playerCounter = 0;
        let prevDate = null;
        let prevPlayerDate = null;
        for (let item of this.data.player) {
            let count = this.data.flight_member.filter((a) => {
                return a.playerId == item.id;
            });
            let SplitDate = item.createdAt.split("T");
            if (SplitDate[0] == prevPlayerDate) {
                playerCounter++;
                 prevPlayerDate=SplitDate[0] ;
                this.dataMembers[this.dataMembers.length - 1]['y'] =
                    playerCounter;
            } else {
                playerCounter = 0;
                playerCounter++;
                prevPlayerDate=SplitDate[0] ;
                let dateObj = {
                    x: new Date(item.createdAt),
                    y: playerCounter,
                };
                this.dataMembers.push(dateObj);
            }
            if (count.length > 0) {
                this.clubPlayers++;
            } else {
                this.mobilePlayers++;
            }
            if (item.gender == 'male') {
                this.male++;
            }
            if (item.gender == 'female') {
                this.female++;
            }
            let obj = {
                name: item.firstName + ' ' + item.lastName,
                date: item.createdAt.substring(0, 10),
                email: item.email,
                phone: item.phone,
                flights: count.length,
            };
            let date = new Date(item.createdAt).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });
            let countA = this.labelsE.find((a) => {
                return a == date;
            });
            console.log(countA);
            if (countA !== undefined && prevDate == countA) {
                memCounter++;
                prevDate = countA;
                this.dataMembersE[this.dataMembersE.length - 1] = memCounter;
                if (
                    countA ==
                    new Date().toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })
                ) {
                    this.dataMembersA.push(memCounter);
                }
                if (countA == 'March 2023') {
                    this.dataMembersB.push(memCounter);
                } else if (countA == 'February 2023') {
                    this.dataMembersC.push(memCounter);
                }
            } else if (countA !== undefined) {
                memCounter = 0;
                memCounter++;
                prevDate = countA;
                this.dataMembersE.push(memCounter);
            }

            rows.push(obj);
        }
        this.clubPlayers = (this.clubPlayers * 100) / this.data.player.length;
        this.mobilePlayers =
            (this.mobilePlayers * 100) / this.data.player.length;
        this.dataSource = new MatTableDataSource(rows);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // for (let items of this.dataMembers) {
        //     if (items.x.toString().includes('Apr')) {
        //         if (this.dataMembersA.length < 3 && items.y > 0) {
        //             this.dataMembersA.push(items.y);
        //         }
        //         this.thisMonth++;
        //     } else if (items.x.toString().includes('Mar')) {
        //         this.lastMonth++;
        //         if (this.dataMembersB.length < 3 && items.y > 0) {
        //             this.dataMembersB.push(items.y);
        //         }
        //     } else if (
        //         items.x.toString().includes('Jan') ||
        //         items.x.toString().includes('Feb') ||
        //         items.x.toString().includes('Dec')
        //     ) {
        //         this.SecondLastMonth++;
        //         if (this.dataMembersC.length < 3 && items.y > 0) {
        //             this.dataMembersC.push(items.y);
        //         }
        //         //  this.dataMembersC.push(items.y);
        //     }
        // }
        console.log(this.dataMembers);
    }

    private _prepareChartData(): void {
        // Visitors
        this.chartVisitors = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width: '100%',
                height: '100%',
                type: 'area',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            colors: ['#818CF8'],
            dataLabels: {
                enabled: false,
            },
            fill: {
                colors: ['#312E81'],
            },
            grid: {
                show: true,
                borderColor: '#334155',
                padding: {
                    top: 10,
                    bottom: -40,
                    left: 0,
                    right: 0,
                },
                position: 'back',
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            series: this.series,
            stroke: {
                width: 2,
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
                x: {
                    format: 'MMM dd, yyyy',
                },
                y: {
                    formatter: (value: number): string => `${value}`,
                },
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    stroke: {
                        color: '#475569',
                        dashArray: 0,
                        width: 2,
                    },
                },
                labels: {
                    offsetY: -20,
                    style: {
                        colors: '#CBD5E1',
                    },
                },
                tickAmount: 20,
                tooltip: {
                    enabled: false,
                },
                type: 'datetime',
            },
            yaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                min: (min): number => min - 500,
                max: (max): number => max + 100,
                tickAmount: 5,
                show: false,
            },
        };

        // Conversions
        this.chartConversions = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#38BDF8'],
            fill: {
                colors: ['#38BDF8'],
                opacity: 0.5,
            },
            series: this.seriesA,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.MonthLabels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => val.toString(),
                },
            },
        };

        // Impressions
        this.chartImpressions = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#34D399'],
            fill: {
                colors: ['#34D399'],
                opacity: 0.5,
            },
            series: this.seriesB,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.MonthLabels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => val.toString(),
                },
            },
        };

        // Visits
        this.chartVisits = {
            chart: {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'area',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#FB7185'],
            fill: {
                colors: ['#FB7185'],
                opacity: 0.5,
            },
            series: this.seriesC,
            stroke: {
                curve: 'smooth',
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                type: 'category',
                categories: this.MonthLabels,
            },
            yaxis: {
                labels: {
                    formatter: (val): string => val.toString(),
                },
            },
        };

        // Visitors vs Page Views
        this.chartVisitorsVsPageViews = {
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
            labels: this.labelsE,
            legend: {
                show: false,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: this._seriesE,
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

        // Gender
        this.chartGender = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#319795', '#4FD1C5'],
            labels: this.genderLabels,
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: this.seriesD,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                     <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                     <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                     <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                 </div>`,
            },
        };

        // Age
        this.chartAge = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#DD6B20', '#F6AD55'],
            labels: [],
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: [],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`,
            },
        };

        // Language
        this.chartLanguage = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#805AD5', '#B794F4'],
            labels: [],
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: [],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`,
            },
        };
        this.showdata = Promise.resolve(true);
    }
}
