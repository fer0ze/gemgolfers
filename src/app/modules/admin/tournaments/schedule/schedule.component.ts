import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo } from 'apollo-angular';
import { Club, ClubSchedule } from '../../../../shared/models/club.model';
import { Player } from '../../../../shared/models/player.model';
import { Constants } from '../../../../shared/classes/general';
import { FacadeService } from 'app/shared/services/facade.service';
import { of } from 'rxjs';
import * as jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import { DialogClubScheduleComponent } from '../../dialogs/dialog-club-schedule/dialog-club-schedule.component';
import { DialogViewScheduleComponent } from '../../dialogs/dialog-view-schedule/dialog-view-schedule.component';
import { LocalStorageService } from 'app/shared/services/localStorage';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  dataSource: MatTableDataSource<ClubSchedule>;
  displayedColumns = ['id', 'tournamentTitle', 'course', 'date'];
  
  //clubItems: Promise<Club[]>;
  noItemsInList = false;
  clubSchedule: ClubSchedule[] = [];
  
  loggedInuser: Player;
  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private location: Router, private apollo: Apollo, public dialog: MatDialog, private facadeService: FacadeService,private _localStorage: LocalStorageService) {
  }

  ngAfterViewInit(): void {
      //this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
      //console.log("getting List");
      //this.Tournaments = await this.facadeService.getActiveTournamentsList("2019-08-22");
      //console.log(this.Tournaments);
        this.clubSchedule = [];
       this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);

        of(this.clubSchedule).pipe()
        .subscribe(async data => {
        if(this.loggedInuser.userRole == 1) {
            let dataTournaments = await this.facadeService.getScheduleList(this.loggedInuser.adminClubId);
            this.clubSchedule = dataTournaments.club_schedule;
        }
        else if(this.loggedInuser.userRole >= 2) {
            //console.log(this.loggedInuser.adminClubId);
            let dataTournaments = await this.facadeService.getScheduleList(this.loggedInuser.adminClubId);
            this.clubSchedule = dataTournaments.club_schedule;
        }

        this.isLoading = false;
        console.log(this.clubSchedule);
        
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.clubSchedule);
        //console.log("change source");
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.Tournaments);
      });

      //this.facadeService.findOne("-LeGr4seWAKipHNVKh_2").subscribe(result => this.myTournament = result);
  }

  public downloadAsPDF() {
    var doc = new jsPDF()

    doc.setFontSize(18);
    doc.text("Club Schedule:", 15, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // From HTML
    doc.autoTable({ 
      html: '#pdfTable', 
      startY: 25,
      useCss: true,
    });
  
    // Open PDF document in new tab
    doc.output('dataurlnewwindow');

    // Download PDF document  
    //doc.save('flights.pdf');
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  redirectToDetails = (detail: any) => {
      //console.log(id);
      const dialogRef = this.dialog.open(DialogViewScheduleComponent, {
        width: '600px',
        data: { schedule: detail }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
            //console.log("record deleted.");
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  redirectToUpdate = (id: string) => {
      this.location.navigate(['/clubs/update/' + id]);
  }

  delesteTournament = (id: string) => {
      
  }

  async delete(id:string) {
      //console.log("Deleting...");
      ///////////////<boolean>await this.facadeService.deleteTournament(id);
      //console.log("Deleted.");
  }

  addSchedule(): void {
      const dialogRef = this.dialog.open(DialogClubScheduleComponent, {
          width: '600px',
          data: "Do you want to delete this record."
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result) {
              //console.log("record deleted.");
              this.clubSchedule = [];
              this.dataSource = new MatTableDataSource(this.clubSchedule);
              this.isLoading = true;
              this.ngOnInit();
          }
          else {
              //console.log("cancel delete action");
          }
      });
  }

}
