import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'app/shared/classes/general';
import { FacadeService } from 'app/shared/services/facade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'app/shared/services/localStorage';
@Component({
  selector: 'app-daily-player-report',
  templateUrl: './daily-player-report.component.html',
  styleUrls: ['./daily-player-report.component.scss']
})
export class DailyPlayerReportComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean = true;
  scheduleForm: FormGroup;
  Players: any[] = [];

  constructor(private facadeService: FacadeService, private datePipe: DatePipe, private fb: FormBuilder,private _localStorage:LocalStorageService
  ) {

  }

  async ngOnInit() {
    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    this.isLoading = false;
    this.scheduleForm = this.fb.group({
      Date: ['', [Validators.required]]
    });
    let todayDate = this.today();

    this.getTotalReport(todayDate);
  }
  async getTotalReport(todayDate: Date) {
    let players: any;
    players = await this.facadeService.getFlightPlayedAdmin(
      '-LUFS3FCQKOGpJ2IEHmf',
      this.datePipe.transform(
        todayDate.toString(),
        'yyyy-MM-dd')
    )

    console.log(players);

    this.Players = [];
    for (let obj of players['flight']) {
      if (obj.members.length > 0) {
        const timeParts = obj.time.split(':');
        const hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);
        const formattedTime = this.formatAMPM(hour, minute);
        obj.members.forEach(element => {
          let newobj = {
            memebrshipNo: element.player.membershipNumber,
            name: element.player.firstName + ' ' + element.player.lastName,
            category: element.player.playerCategory,
            tee: obj.tee,
            holeSets: this.getCourseHoleSets(obj.courseHoleSets, obj.courseHoleSetsInverted),
            time: formattedTime,
          };
          this.Players.push(newobj);
        });
      }

    }
    this.dataSource = new MatTableDataSource(this.Players);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = true;
  }
  formatAMPM(hours: number, minutes: number): string {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  today() {
    let date = new Date();
    return new Date(date.setDate(date.getDate()));
  }
  getCourseHoleSets(holeSet, inverted) {
    if (holeSet == 4 && inverted == false) {
      return 'Blue 9';
    } else if (holeSet == 1 && inverted == false) {
      return 'Red 9';
    } else if (holeSet == 8 && inverted == false) {
      return 'Yellow 9';
    } else if (holeSet == 3 && inverted == false) {
      return 'Red Front 9 - Blue Back 9';
    } else if (holeSet == 12 && inverted == false) {
      return 'Blue Front 9 - Yellow Back 9';
    } else if (holeSet == 9 && inverted == false) {
      return 'Blue Front 9 - Yellow Back 9';
    }
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


}
