import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar,} from "@angular/material/snack-bar";

import { Player } from "../../../shared/models/player.model";

import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { FacadeService } from "../../../shared/services/facade.service";
import { Constants } from "../../../shared/classes/general";

import { DatePipe } from "@angular/common";
import { General } from "../../../shared/classes/general";

import { of } from "rxjs";

@Component({
  selector: "app-daily-rounds",
  templateUrl: "./daily-rounds.component.html",
  styleUrls: ["./daily-rounds.component.scss"],
})
export class DailyRoundsComponent implements OnInit {
  isLoading: boolean = false;
  dailyRounds: any = [];
  loggedInuser: Player;
  minDate: Date;
  maxDate: Date;
  scheduleForm: FormGroup;
  showtable: boolean = true;
  public starterForm: FormGroup;
  routeDate: any;
  dailyStats: any[] = [];
  filters: FormGroup;
  customValue: boolean;
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    "id",
    "dates",
    "noOfFlights",
    "membersCount",
    "details",
    "score",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private datePipe: DatePipe,
    private location: Router,
    private router: Router,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private facadeService: FacadeService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.showtable = false;
  }

  async ngOnInit() {
   
    this.isLoading = true;
    this.filters = this._formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
    });
    this.scheduleForm = this.fb.group({
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
    });
    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );

    this.dailyRounds = [];
    // this.route.paramMap.subscribe((params) => {
    //   this.routeDate = params.get("id");
    // });

    var currentDate = new Date();
    // if (this.routeDate) currentDate = General.parseToDate(this.routeDate);
    // else

    currentDate.setDate(currentDate.getDate());

    this.getDailyRounds(currentDate, currentDate);

    //this.facadeService.findOne("-LeGr4seWAKipHNVKh_2").subscribe(result => this.myPlayer = result);
  }

  async getDailyRounds(fromDate: Date, toDate: Date) {
    this.dailyStats = [];
    this.showtable = false;
    this.isLoading = true;
    let dataPlayers = await this.facadeService.getDailyRoundsSingle(
      this.loggedInuser.adminClubId,
      this.datePipe.transform(fromDate.toString(), "yyyy-MM-dd"),
      this.datePipe.transform(toDate.toString(), "yyyy-MM-dd")
    );
    console.log(dataPlayers);

    this.dailyStats = [];
    if (dataPlayers.TournamentsQL) {
      for (let i = 0; i < dataPlayers.TournamentsQL.length; i++) {
        var dailyStat = null;
        dailyStat = {
          date: dataPlayers.TournamentsQL[i].startDate,
          membersCount:
            dataPlayers.TournamentsQL[i].FlightsQL.length > 0
              ? dataPlayers.TournamentsQL[i].FlightsQL[0].MembersQL.length
              : 0,
          noOfFlights: dataPlayers.TournamentsQL[i].FlightsQL.length,
        };
        this.dailyStats.push(dailyStat);
      }

      this.dailyStats = this.dailyStats.sort(this.ComparatorDate);
      this.isLoading = false;
      this.showtable = true;

      // this.getSelectedCourse("-LUFS3FCQKOGpJ2IEHmf");
    }

    console.log(this.dailyStats);
    let myData: any[] = [];
    let prevDate = null;
    let memCounter = 0;
    let totalFlights = 0;

    for (let stats of this.dailyStats) {
      if (stats.date == prevDate) {
        memCounter = memCounter + stats.membersCount;
        totalFlights = totalFlights + stats.noOfFlights;

        myData[myData.length - 1].membersCount = memCounter;
        myData[myData.length - 1].totalFlights = totalFlights;
        prevDate = stats.date;
      } else {
        memCounter = 0;
        totalFlights = 0;
        memCounter = memCounter + stats.membersCount;
        totalFlights = totalFlights + stats.noOfFlights;

        let obj = {
          date: stats.date,
          membersCount: memCounter,
          totalFlights: totalFlights,
        };

        myData.push(obj);
        prevDate = stats.date;
      }
    }

    console.log(myData);

    this.dataSource = null;
    this.dataSource = new MatTableDataSource(myData);
  }

  redirectToPlayersScore = (id: string) => {
    this.showtable = false;
    this.isLoading = true;
    this.location.navigate([
      "daily-rounds/add-player-daily-score/filter/" + id,
    ]);
  };

  ComparatorDate(a, b) {
    if (a["date"] < b["date"]) return -1;
    if (a["date"] > b["date"]) return 1;
    return 0;
  }
  redirectToView = (date: string) => {
    this.router.navigate(["/dailyRounds/view-daily-rounds/" + date]);
  };
  newRound()  {
    this.router.navigate(["/dailyRounds/add-daily-rounds"]);
  };
  onDatePick() {
    console.log(this.scheduleForm.value.startDate);
    console.log(this.scheduleForm.value.endDate);
    if (this.scheduleForm.value.startDate) {
      let lastDate = this.scheduleForm.value.endDate;
      let startDate = this.scheduleForm.value.startDate;
      if (lastDate == "") {
        lastDate = startDate;
      }
      if (startDate == "") {
        startDate = lastDate;
      }
      // lastDate = startDate ? lastDate == "" : lastDate;
      // startDate = lastDate ? startDate == "" : startDate;

      console.log(lastDate);
      console.log(startDate);
      this.getDailyRounds(lastDate, startDate);
    } else {
    }
  }

  Dailysetup(selectedValue) {
    //console.log(selectedValue)
    if (selectedValue.value == Constants.DR_TODAY) {
      this.customValue = false;
      let currentDate = new Date();
      this.getDailyRounds(currentDate, currentDate);
    } else if (selectedValue.value == Constants.DR_YESTERDAY) {
      this.customValue = false;
      let currentDate = new Date();
      let lastDate = this.yesterday();
      //console.log(currentDate)
      //console.log(lastDate)

      this.getDailyRounds(currentDate, lastDate);
    } else if (selectedValue.value == Constants.DR_LAST_WEEK) {
      this.customValue = false;
      let currentDate = new Date();
      let lastDate = this.endOfWeek();
      //console.log(currentDate)
      //console.log(lastDate)

      this.getDailyRounds(currentDate, lastDate);
    } else if (selectedValue.value == Constants.DR_LAST_MONTH) {
      this.customValue = false;
      let currentDate = new Date();
      let lastDate = this.endOfMonth();
      //console.log(currentDate)
      //console.log(lastDate)

      this.getDailyRounds(currentDate, lastDate);
    } else if (selectedValue.value == Constants.DR_CUSTOM) {
      this.customValue = true;
      // let currentDate = this.customDate.value;
      // let lastDate = this.customDate2.value;
      // console.log(currentDate)
      // console.log(lastDate)
      // this.getDailyRounds(currentDate,lastDate);
    } else {
    }
  }
  yesterday() {
    let date = new Date();
    return new Date(date.setDate(date.getDate() - 1));
  }

  endOfWeek() {
    let date = new Date();
    return new Date(date.setDate(date.getDate() - 7));
  }

  endOfMonth() {
    let date = new Date();
    return new Date(date.setDate(date.getDate() - 29));
  }
}
