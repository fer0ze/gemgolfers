import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Constants, General } from 'app/shared/classes/general';
import { FacadeService } from 'app/shared/services/facade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { DailyReportService } from './daily-player.service';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
@Component({
  selector: 'app-daily-player-report',
  templateUrl: './daily-player-report.component.html',
  styleUrls: ['./daily-player-report.component.scss'],
})
export class DailyPlayerReportComponent implements OnInit, AfterViewInit {
  chartBudgetDistribution: ApexOptions = {}
  chartGithubIssues: ApexOptions = {};
  minDate: Date;
  maxDate: Date;
  public barChartLabels: string[] = [];
  dataSource: MatTableDataSource<any>;
  loggedInuser: any;
  displayedColumnsCongu = [
    'id',
    'memebrshipNo',
    'name',
    'category',
    'holeSet',
    'tee',
    'time',
  ];
  public courseholesets: any[] = [
    'Red 9',
    'Yellow 9',
    'Blue 9',
    'Red 9 - Blue 9',
    'Red 9 - Yellow 9',
    'Blue 9 - Yellow 9',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean = true;
  isPlayer: boolean = true;
  scheduleForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  Players: any[] = [];
  _series: any = [];

  constructor(
    private facadeService: FacadeService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private _localStorage: LocalStorageService,
    private _reportService: DailyReportService
  ) { }


  async ngOnInit() {
    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    this.isPlayer = true;
    this._reportService.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        console.log(data);
        this.chart(data.series, data.labels, data.holesSet)
        if (data.todayData.length > 0) {
          this.isPlayer = true;
          this.dataSource = new MatTableDataSource(data.todayData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = true;
        } else {
          this.isPlayer = false;
        }
      });
    this.isLoading = false;
    this.scheduleForm = this.fb.group({
      Date: ['', [Validators.required]],
    });
    let todayDate = this.today();

    //his.getTotalReport(todayDate);
  }
  ngAfterViewInit(): void {
    if (this.isPlayer) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  async getTotalReport(todayDate: Date) {
    let players: any;
    players = await this.facadeService.getFlightPlayedAdmin(
      '-LUFS3FCQKOGpJ2IEHmf',
      this.datePipe.transform(todayDate.toString(), 'yyyy-MM-dd')
    );

    console.log(players);

    this.Players = [];
    for (let obj of players['flight']) {
      if (obj.members.length > 0) {
        this.isPlayer = true;
        const timeParts = obj.time.split(':');
        const hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);
        const formattedTime = General.formatAMPM(hour, minute);
        obj.members.forEach((element) => {
          let newobj = {
            memebrshipNo: element.player.membershipNumber,
            name:
              element.player.firstName +
              ' ' +
              element.player.lastName,
            category: element.player.playerCategory,
            tee: element.playingTee,
            holeSet: General.getCourseHoleSets(
              obj.courseHoleSets,
              obj.courseHoleSetsInverted
            ),
            time: formattedTime,
          };
          this.Players.push(newobj);
        });
      }
    }
    this.Players.sort((a, b) => {
      const timeA = new Date(`01/01/2000 ${a.time}`);
      const timeB = new Date(`01/01/2000 ${b.time}`);
      return (timeB.getTime() - timeA.getTime()) as number; // Cast the result to number
    });
    this.dataSource = new MatTableDataSource(this.Players);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = true;
  }

  today() {
    let date = new Date();
    return new Date(date.setDate(date.getDate()));
  }

  onDatePick() {
    if (this.scheduleForm.value.Date) {
      //let lastDate = this.scheduleForm.value.endDate;
      let Date = this.scheduleForm.value.Date;
      this.getTotalReport(Date);
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  chart(series, lables, _HolesSetsseries) {
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
      labels: lables,
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      series: series,
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

    this.chartBudgetDistribution = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'radar',
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#818CF8'],
      dataLabels: {
        enabled: true,
        formatter: (val: number): string | number => `${val}`,
        textAnchor: 'start',
        style: {
          fontSize: '13px',
          fontWeight: 500,
        },
        background: {
          borderWidth: 0,
          padding: 4,
        },
        offsetY: -15,
      },
      markers: {
        strokeColors: '#818CF8',
        strokeWidth: 4,
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: 'var(--fuse-border)',
            connectorColors: 'var(--fuse-border)',
          },
        },
      },
      series: _HolesSetsseries,
      stroke: {
        width: 2,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number): string => `${val}`,
        },
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            fontWeight: '500',
          },
        },
        categories: this.courseholesets,
      },
      yaxis: {
        max: (max: number): number =>
          parseInt((max + 10).toFixed(0), 10),
        tickAmount: 7,
      },
    };
  }
}
