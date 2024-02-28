import { Component, OnInit, ViewChild } from '@angular/core';
import {
    Player,
    PlayerCategory,
    Marshal,
} from '../../../../shared/models/player.model';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../../../shared/classes/general';
import { FacadeService } from '../../../../shared/services/facade.service';
import { SelectionModel } from '@angular/cdk/collections';
import { TournamentMember } from '../../../../shared/models/tournament.model';
import { FlightManagementComponent } from '../flight-management/flight-management.component';
import { LocalStorageService } from 'app/shared/services/localStorage';

@Component({
    selector: 'app-player-management',
    templateUrl: './player-management.component.html',
    styleUrls: ['./player-management.component.scss'],
})
export class PlayerManagementComponent implements OnInit {
    loggedInuser: any;
    clubMembers: any[];
    tournamentMember: any;
    aggregate: any;
    aggregates: any;
    categoryCounts: any = [];
    player: any[];
    TMcategoryCounts: any[];
    index: any = 0;
    indexs: any = 0;
    selection = new SelectionModel<Player>(true, []);
    pageSize: any = 20;
    pageSizes: any = 20;
    isLoading: boolean = true;
    selectPlayer: any;
    dataSource: MatTableDataSource<any>;
    displayedColumns = [
        'firstName',
        'lastName',
        'handicap',
        'playerCategory',
        'action',
    ];
    membersColumns: string[] = [
        'firstName',
        'lastName',
        'handicap',
        'category',
        'delete',
    ];
    dataSources: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginators: MatPaginator;
    @ViewChild(MatSort) sorts: MatSort;
    tournamentID: string;
    showCategory: boolean;
    selectedMembers: any[];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        public _flightManagmentComponent: FlightManagementComponent,
        private facadeService: FacadeService,
        private _localStorage: LocalStorageService
    ) {}

    async ngOnInit() {
         this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        //console.log(this.loggedInuser);
        let selectedClubId: string = this.loggedInuser.adminClubId;
        this.route.paramMap.subscribe((params) => {
            this.tournamentID = params.get('id');
        });
        this.clubMembers = [];
        //console.log(selectedClubId);
        let dataFullTournaments = await this.facadeService.getTournamentMembers(
            this.tournamentID
        );
        //console.log(dataFullTournaments);

        this.tournamentMember = dataFullTournaments.TournamentMemberQL;
        this.clubMembers = await this.facadeService.getPlayerByClub(
            selectedClubId
        );
        this.aggregate =
            this.clubMembers['AggregateQL']['aggregate'].totalCount;

        this.syncClubMembers();
        this.syncTournamentMembers();
    }

    syncClubMembers() {
        let count = 0;
        this.player = [];
        for (
            this.index;
            this.index < this.clubMembers['club_member'].length;
            this.index++
        ) {
            ////console.log(this.index);

            let flag: boolean = false;
            for (let c of this.tournamentMember) {
                if (
                    c.playerId ==
                    this.clubMembers['club_member'][this.index]['player'].id
                ) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                count++;
                this.player.push(this.clubMembers['club_member'][this.index]);
                if (count >= this.pageSize) break;
            }
        }

        this.index = 0;
        this.dataSources = new MatTableDataSource(this.player);
        this.dataSources.sort = this.sort;
        // this.dataSources.paginator = this.paginator;
        this.isLoading = false;
        //console.log(this.dataSources);

        this.player = [];
        //setTimeout(() => (this.dataSources.paginator = this.paginators), 2000);
    }
    syncTournamentMembers() {
        //console.log(this.tournamentMember.length);
        // //console.log(this.selectedMembers);
        // let count = 0;
        this.aggregates = this.tournamentMember.length;
        let flightPlayers: any[] = [];
        // if (this.selectedMembers.length > 0) {
        //   for (let member of this.tournamentMember) {
        //     for (
        //       let index = 0;
        //       index < this.selectedMembers[count].length;
        //       index++
        //     ) {
        //       if (this.selectedMembers[count][index].id == member.playerId) {
        //         let obj = {
        //           playerId: member.playerId,
        //         };
        //         flightPlayers.push(obj);
        //         break;
        //       }

        //       if (
        //         this.selectedMembers.length - 1 > count &&
        //         this.selectedMembers[count].length <= index + 1
        //       ) {
        //         count++;
        //         index = -1;
        //       }
        //     }
        //     count = 0;
        //   }
        // }
        // //console.log(flightPlayers);
        // if (flightPlayers.length > 0) {
        // for (let member of flightPlayers) {
        //   let index = 0;
        //   for (let mem of this.tournamentMember) {
        //     if (mem.playerId == member.playerId) {
        //       this.tournamentMember[index].status = true;
        //     }

        //     index++;
        //   }
        // }
        //  }
        let count = 0;
        this.player = [];
        for (
            this.indexs;
            this.indexs < this.tournamentMember.length;
            this.indexs++
        ) {
            ////console.log(this.index);

            count++;
            this.player.push(this.tournamentMember[this.indexs]);
            if (count >= this.pageSizes) break;
        }

        this.indexs = 0;
        //console.log(this.tournamentMember);
        this.dataSource = new MatTableDataSource(this.tournamentMember);
        this.dataSource.sort = this.sorts;
        this.isLoading = false;
        this.player = [];
        //  setTimeout(() => (this.dataSource.paginator = this.paginator), 1000);
    }
    addPlayer() {}
    addExistingPlayer() {}
    applyMembersFilter(event) {}
    public closedrawer(id) {
        this._flightManagmentComponent.closedrawer(id);
    }
    onPageFired(event) {
        this.index = event.pageIndex * event.pageSize;
        this.pageSize = event.pageSize;
        //console.log(this.index);
        this.syncClubMembers();

        //console.log(event);
    }
    onPageFireds(event) {
        this.indexs = event.pageIndex * event.pageSizes;
        this.pageSizes = event.pageSizes;
        //console.log(this.index);
        this.syncTournamentMembers();

        //console.log(event);
    }
    checkboxLabel(row?: Player): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${
            this.selection.isSelected(row) ? 'deselect' : 'select'
        } player ${row.firstName} ${row.lastName}`;
    }
    isAllSelected() {
        ////console.log(this.dataSource);
        if (this.dataSources) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSources.data.length;
            return numSelected === numRows;
        }
    }
    async saveTournamentMembers() {
        let tournamentmember: TournamentMember[] = [];
        let counter: number;
        let DelplayerIndex: any;
        let DelplayerInfo: any;
        let selectionArray = Object.assign({}, this.selection.selected);

        for (var index in selectionArray) {
            if (selectionArray[index]) {
                let founded = this.tournamentMember.filter((a) => {
                    return a.playerId == selectionArray[index]['player'].id;
                });

                if (founded.length == 0) {
                    //this.tournamentMember.push(selectionArray[index]);

                    let obj = {
                        fullName: selectionArray[index]['player']['fullName'],
                        player: {
                            firstName:
                                selectionArray[index]['player']['firstName'],
                            id: selectionArray[index]['player']['id'],
                            handicap:
                                selectionArray[index]['player']['handicap'],
                            lastName:
                                selectionArray[index]['player']['lastName'],
                            playerCategory:
                                selectionArray[index]['player'][
                                    'playerCategory'
                                ],
                        },
                        playerId: selectionArray[index]['player']['id'],
                        tournamentId: this.tournamentID,
                        status: false,
                    };
                    //console.log(obj);
                    this.tournamentMember.push(obj);

                    let member: any = {
                        tournamentId: this.tournamentID,
                        playerId: selectionArray[index]['player'].id,
                        status: true,
                    };
                    tournamentmember.push(member);
                }
                counter = parseInt(index) + 1;
                //console.log(counter);

                //console.log(selectionArray);
            }
        }
        this.showCategory = false;
        this.categoryCounts = [];
        ////console.log(this.categoryCounts[0]);

        //this.categoryCounts[0].value = this.categoryCounts[0].value - counter;
        ////console.log(this.categoryCounts[0].value);

        //console.log(tournamentmember);

        let result = <any>(
            await this.facadeService.insertTournamentMember(tournamentmember)
        );

        if (result) {
            this.snackBar.open('Tournament members have been saved.', 'x', {
                duration: 5000,
            });
            this.syncTournamentMembers();
            this.syncClubMembers();

            this.masterToggle();
        }
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        //console.log(this.selection);
        //console.log(this.selection.selected.length);
        this.selection.clear();
    }

    updateCategorySelection(event, row) {
        //console.log(row);

        //console.log(this.selection.isSelected(row));
        let status = false;

        if (typeof event.checked !== 'undefined')
            status = event.checked ? true : false;
        else {
            //console.log(this.selection.isSelected(row));
            status = this.selection.isSelected(row) ? false : true;
        }

        this.countCategoryMember(status, row);

        //console.log(this.categoryCounts);
    }

    countCategoryMember(status, row) {
        let founded = this.categoryCounts.filter((a) => {
            return a.name == row.player.playerCategory;
        });
        //console.log(founded);

        if (status) {
            if (founded.length > 0) {
                founded[0].value = founded[0].value + 1;
            } else {
                let obj = {
                    name: row.player.playerCategory,
                    value: 1,
                };
                this.categoryCounts.push(obj);
            }
        } else {
            if (founded.length > 0) {
                status
                    ? (founded[0].value = founded[0].value - 1)
                    : (founded[0].value = founded[0].value - 1);
                //console.log(this.categoryCounts);
            }
        }
    }
}
