import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router} from '@angular/router'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Player } from '../../../shared/models/player.model';
import { TeeTime, TeeTimeSlot } from '../../../shared/models/teetime.model';
import { FacadeService } from '../../../shared/services/facade.service';
// import { DialogOverviewComponent } from '../material-components/dialog-overview/dialog-overview.component';
// import { DialogTeeTimeSlotComponent } from '../material-components/dialog-tee-time-slot/dialog-tee-time-slot.component';
import { UniqueIdGenerator, generateGemId, Constants, General } from '../../../shared/classes/general';
import { of } from 'rxjs';
import { DialogTeeTimeSlotComponent } from '../dialogs/dialog-tee-time-slot/dialog-tee-time-slot.component';

@Component({
  selector: 'app-tee-times',
  templateUrl: './tee-times.component.html',
  styleUrls: ['./tee-times.component.scss']
})
export class TeeTimesComponent implements OnInit {

  dataSource: MatTableDataSource<TeeTime>;
  displayedColumns = ['id', 'bookingDate', 'startTime', 'endTime', 'interval', 'allowNineHole', 'slots'];
  
  clubItems: Promise<TeeTime[]>;
  noItemsInList = false;
  teeTimes: TeeTime[] = [];
  myPlayer: TeeTime;
  isLoading: Boolean = true;
  loggedInuser: Player;

  file: File;
  arrayBuffer: any;
  playersData: any;
  savePlayers: TeeTime[] = [];
  duplicatePlayers: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @ViewChild('fileInput') fileInputVariable: ElementRef;
  

  constructor(private location: Router,  public snackBar: MatSnackBar, public dialog: MatDialog, private facadeService: FacadeService) {
  }

  ngAfterViewInit(): void {
      //this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
      
    this.loggedInuser = JSON.parse(localStorage.getItem(Constants.LOGGED_IN_USER));
    this.teeTimes = [];
        
    of(this.teeTimes).pipe()
    .subscribe(async data => {
        let dataPlayers = await this.facadeService.getClubTeeTimeBooking(this.loggedInuser.adminClubId);
        this.teeTimes = dataPlayers.tee_time_booking;
        this.isLoading = false;

        console.log(this.teeTimes);

        this.dataSource = new MatTableDataSource(this.teeTimes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }, error => this.isLoading = false);
   
    
      //this.facadeService.findOne("-LeGr4seWAKipHNVKh_2").subscribe(result => this.myPlayer = result);
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  redirectToDetails = (id: string) => {
      this.location.navigate(['/players/view/' + id]);
  }

  redirectToUpdate = (id: string) => {
      this.location.navigate(['/players/update/' + id]);
  }

  listTeeTimeSlots(slots: any): void {

    const dialogRef = this.dialog.open(DialogTeeTimeSlotComponent, {
        width: '600px',
        data: {slots: slots }
    });

    dialogRef.afterClosed().subscribe(async result => {
        if(result) {
            this.snackBar.open("Member has been deleted.", "x", {
              duration: 5000,
            });

            this.teeTimes = [];
            this.isLoading = true;
            this.dataSource = new MatTableDataSource(this.teeTimes);
            this.ngOnInit();
        }
        else {
            //console.log("cancel delete action");
        }
    });
    }

}
