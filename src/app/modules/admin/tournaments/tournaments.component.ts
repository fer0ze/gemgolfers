import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tournament } from '../../../shared/models/tournament.model';
import {
    Player,
    PlayerHanidcap,
    IPlayerHandicapWhs,
    ClubMembership,
} from '../../../shared/models/player.model';
import {
    Constants,
    General,
    generateGemId,
    UniqueIdGenerator,
} from '../../../shared/classes/general';
import { FacadeService } from 'app/shared/services/facade.service';
// import { DialogOverviewComponent } from "../material-components/dialog-overview/dialog-overview.component";

import { of } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { DialogHanidcapListComponent } from '../dialogs/dialog-hanidcap-list/dialog-hanidcap-list.component';

@Component({
    selector: 'app-tournaments',
    templateUrl: './tournaments.component.html',
    styleUrls: ['./tournaments.component.scss'],
})
export class TournamentsComponent implements OnInit {
    dataSource: MatTableDataSource<Tournament>;
    displayedColumns = [
        'id',
        'title',
        'date',
        'noOfRounds',
        'details',
        'delete',
        'handicap',
    ];
    tournamentID: string;
    arrayBuffer: any;
    dataSourceUpComing: MatTableDataSource<Tournament>;
    displayedColumnsUpComing = [
        'id',
        'title',
        'date',
        'noOfRounds',
        'details',
        'delete',
    ];
    file: File;
    dataSourceSchedule: MatTableDataSource<Tournament>;
    displayedColumnsSchedule = ['id', 'tournamentTitle', 'course', 'date'];

    dataSourceIncomplete: MatTableDataSource<Tournament>;
    displayedColumnsIncomplete = ['id', 'title', 'date', 'noOfRounds'];
    playersData: any;
    clubItems: Promise<Tournament[]>;
    noItemsInList = false;
    Tournaments: Tournament[] = [];
    TournamentsUpComing: Tournament[] = [];
    TournamentsSchedule: Tournament[] = [];
    TournamentsIncomplete: Tournament[] = [];
    myTournament: Tournament;
    loggedInuser: Player;
    isLoading: boolean = true;
    isLoadingUpComing: boolean = true;
    isLoadingSchedule: boolean = true;
    isIncompletedLoading: boolean = true;
    handicapCalculated: PlayerHanidcap[] = [];
    selected: number = 0;
    savePlayers: any[];
    duplicatePlayers: any[];
    selectedProject: string = 'ACME Corp. Backend App';
    categories: any[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private location: Router,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private facadeService: FacadeService
    ) {}

    ngAfterViewInit(): void {
        //this.dataSource.sort = this.sort;
    }

    async ngOnInit() {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        let array = {
            id: 0,
            title: 'Completed',
        };
        let arraya = {
            id: 1,
            title: 'Live',
        };
        let arrayb = {
            id: 2,
            title: 'Incomplete',
        };
        let arrayc = {
            id: 3,
            title: 'Schedule',
        };
        this.categories.push(array);
        this.categories.push(arraya);
        this.categories.push(arrayb);
        this.categories.push(arrayc);
        console.log(this.categories);

        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        if (this.loggedInuser.userRole == 1) {
            let dataTournamentsForCompleted =
                await this.facadeService.getTournamentsListForCompleted(
                    todayDate
                );
            this.Tournaments = dataTournamentsForCompleted.CompletedRecently;
            console.log(this.Tournaments);
            this.dataSource = new MatTableDataSource(this.Tournaments);
            //console.log("change source");
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isLoading = false;
        } else if (this.loggedInuser.userRole >= 2) {
            let dataTournamentsForCompleted =
                await this.facadeService.getTournamentsListByClubForCompleted(
                    todayDate,
                    this.loggedInuser.adminClubId
                );

            this.Tournaments = dataTournamentsForCompleted.CompletedRecently;
            this.isIncompletedLoading = false;
            this.isLoading = false;
            console.log(this.Tournaments);
            this.dataSource = new MatTableDataSource(this.Tournaments);

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    filterByCategory($event) {
        console.log($event);
        if (this.loggedInuser.userRole >= 2) {
          if ($event.value == 1) {
              this.getTournamentLive();
          } else if ($event.value == 2) {
              this.getTournamentSchedule();
          } else if ($event.value == 3) {
              this.getTournamentIncompelete();
          } else {
              this.getTournamentCompeleted();
          }
      } else {
          if ($event.value == 1) {
              this.getTournamentLiveForAdmin();
          } else if ($event.value == 2) {
              this.getTournamentScheduleForAdmin();
          } else if ($event.value == 3) {
              this.getTournamentIncompeleteForAdmin();
          } else {
              this.getTournamentCompeletedForAdmin();
          }
      }
    }
    filterByQuery(query) {
        console.log(query);
            }
    tabClicked(tab: any) {
        console.log(tab);
        if (this.loggedInuser.userRole >= 2) {
            if (tab.index == 1) {
                this.getTournamentLive();
            } else if (tab.index == 2) {
                this.getTournamentSchedule();
            } else if (tab.index == 3) {
                this.getTournamentIncompelete();
            } else {
                this.getTournamentCompeleted();
            }
        } else {
            if (tab.index == 1) {
                this.getTournamentLiveForAdmin();
            } else if (tab.index == 2) {
                this.getTournamentScheduleForAdmin();
            } else if (tab.index == 3) {
                this.getTournamentIncompeleteForAdmin();
            } else {
                this.getTournamentCompeletedForAdmin();
            }
        }
    }
    async getTournamentCompeleted() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsForCompleted =
            await this.facadeService.getTournamentsListByClubForCompleted(
                todayDate,
                this.loggedInuser.adminClubId
            );
        //console.log(dataTournaments);
        this.isIncompletedLoading = false;
        this.isLoadingUpComing = false;
        this.Tournaments = dataTournamentsForCompleted.CompletedRecently;
        this.dataSource = new MatTableDataSource(this.Tournaments);
        this.isLoading = false;
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.Tournaments);
        //console.log("change source");
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.Tournaments);
    }

    async getTournamentLive() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsLive =
            await this.facadeService.getTournamentsListByClubForLive(
                todayDate,
                this.loggedInuser.adminClubId
            );
        console.log(dataTournamentsLive);

        this.Tournaments = dataTournamentsLive.ActiveTournaments;
    }
    async getTournamentSchedule() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsLive =
            await this.facadeService.getTournamentsListByClubForSchedule(
                todayDate,
                this.loggedInuser.adminClubId
            );
        console.log(dataTournamentsLive);

        this.Tournaments = dataTournamentsLive.Scheduled;

        //console.log("change source");
    }

    async getTournamentIncompelete() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsLive =
            await this.facadeService.getTournamentsListByClubForIncompelete(
                todayDate,
                this.loggedInuser.adminClubId
            );
        this.Tournaments = dataTournamentsLive.Scheduled;

        //console.log("change source");
    }

    async getTournamentCompeletedForAdmin() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsForCompleted =
            await this.facadeService.getTournamentsListForCompleted(todayDate);
        //console.log(dataTournaments);
        this.isIncompletedLoading = false;
        this.isLoadingUpComing = false;
        this.Tournaments = dataTournamentsForCompleted.CompletedRecently;
        this.dataSource = new MatTableDataSource(this.Tournaments);
        this.isLoading = false;
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(this.Tournaments);
        //console.log("change source");
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.Tournaments);
    }

    async getTournamentLiveForAdmin() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsForLive =
            await this.facadeService.getTournamentsListForLiveByAdmin(
                todayDate
            );
        console.log(dataTournamentsForLive);

        this.Tournaments = dataTournamentsForLive.ActiveTournaments;
    }

    async getTournamentScheduleForAdmin() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsForSchedule =
            await this.facadeService.getTournamentsListForSheduleByAdmin(
                todayDate
            );
        console.log(dataTournamentsForSchedule);

        this.Tournaments;
        dataTournamentsForSchedule.Scheduled;
    }

    async getTournamentIncompeleteForAdmin() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let dataTournamentsForIncomplete =
            await this.facadeService.getTournamentsListForIncompleteByAdmin(
                todayDate
            );
        this.Tournaments = dataTournamentsForIncomplete.Scheduled;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyFilterUpComing(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSourceUpComing.filter = filterValue;

        if (this.dataSourceUpComing.paginator) {
            this.dataSourceUpComing.paginator.firstPage();
        }
    }

    redirectToDetails = (id: string) => {
        //console.log(id);
        this.location.navigate(['tournaments/view/' + id]);
    };

    redirectToUpdate = (id: string) => {
        this.location.navigate(['/clubs/update/' + id]);
    };

    handicapList(
        list: PlayerHanidcap[],
        listWhs: IPlayerHandicapWhs[],
        Whs: boolean
    ): void {
        let listView;
        if (Whs) listView = listWhs;
        else listView = list;

        console.log(listView);

        if (listView.length > 0) {
            const dialogRef = this.dialog.open(DialogHanidcapListComponent, {
                width: '800px',
                data: { handicaps: listView, Whs: Whs },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    //console.log("record deleted.");
                    //this.delete(id);
                    //this.ngOnInit();
                } else {
                    //console.log("cancel delete action");
                }
            });
        }
    }

    menuChange(a) {
        this.selectedProject = 'Live';
        console.log(a);
    }
}
