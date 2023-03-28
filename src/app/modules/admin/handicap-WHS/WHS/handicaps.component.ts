import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import "jspdf-autotable";
import * as jsPDF from "jspdf";
import {
    Player,
    ClubMembership,
    PlayerWHSHanidcap,
} from '../../../../shared/models/player.model';
import { FacadeService } from '../../../../shared/services/facade.service';

import {
    UniqueIdGenerator,
    generateGemId,
    Constants,
    General,
} from '../../../../shared/classes/general';
import { of, Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';

import { filter } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
@Component({
    selector: 'app-handicaps',
    templateUrl: './handicaps.component.html',
})
export class HandicapsComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    WHSSource: MatTableDataSource<any>;
    WHSColumns = [
        'id',
        'name',
        'email',
        'membershipNumber',
        'category',
        'handicapWhsIndex',
        'details',
    ];
    count: any = 0;
    showTable: Promise<any>;
    clubItems: Promise<Player[]>;
    public player: any[] = [];
    noItemsInList = false;
    Players: Player[] = [];
    myPlayer: Player;
    isLoading: Boolean = true;
    public response: any;
    loggedInuser: Player;
    filterCategory: string;
    playerWHS: PlayerWHSHanidcap;
    playerWHSHistory: any;
    HandicapIndex: any[] = [];
    clubMemberAggregate: Array<any> = [];
    totalMembers: number = 0;
    superAdminstats: Array<any> = [];
    MembersCat: string;
    file: File;
    currentDate: Date;
    arrayBuffer: any;
    playersData: any;
    savePlayers: Player[] = [];
    duplicatePlayers: any[] = [];
    selectedRowIndex: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataPlayers: any;
    index: any = 0;
    aggregate = 0;
    pageSize: any = 20;
    tabindex: any = 0;
    sorting: any;
    constructor(
        private location: Router,
        private _router: ActivatedRoute,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _facadeService: FacadeService,
        private datepipe: DatePipe,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngAfterViewInit(): void {
        //this.dataSource.sort = this.sort;
    }

    async ngOnInit() {
        //this.fecthData();

        this.currentDate = new Date();
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        this.Players = [];

        this._router.paramMap.subscribe((params) => {
            this.filterCategory = params.get('category');
        });
        console.log(this.filterCategory);

        this.MembersCat = this.filterCategory;
        console.log(this.MembersCat);
        if (this.loggedInuser.adminClubId) {
            if (this.loggedInuser.userRole == 1) {
                // this.getAllMemberAggregateByCategroy(
                //     this.loggedInuser.adminClubId
                // );
                // this.getSuperAdminStats();
            }
            // this.getClubMemberAggregateByCategroy(
            //     this.loggedInuser.adminClubId
            // );

            //dataTournaments = await this.facadeService.getClubActiveTournamentsList(todayDate.toDateString(), this.loggedInuser.adminClubId);
        }

        if (this.loggedInuser.userRole > 1) {
            if (this.filterCategory)
                this.dataPlayers =
                    await this._facadeService.getPlayersListByClubAndCategory(
                        this.loggedInuser.adminClubId,
                        General.capitalizeFirstLetter(this.filterCategory)
                    );
            else {
                this.dataPlayers =
                    await this._facadeService.getPlayersListByClubOnlyWHS(
                        this.loggedInuser.adminClubId
                    );
                // this.aggregate =
                //     this.dataPlayers.AggregateQL['aggregate'].totalCount;
                console.log(this.aggregate);
                this.syncHandicapWHS();

                // this.WHSSource = new MatTableDataSource(this.HandicapIndex);
                // console.log(this.WHSSource);
                // this.WHSSource.sort = this.sort;
                // setTimeout(() => (this.WHSSource.paginator = this.paginator), 1000);
            }
        } else {
            if (this.filterCategory)
                this.dataPlayers =
                    await this._facadeService.getPlayerByCategory(
                        General.capitalizeFirstLetter(this.filterCategory)
                    );
            else {
                this.dataPlayers = await this._facadeService.getPlayersList();
                console.log(this.dataPlayers);

                // this.aggregate =
                //     this.dataPlayers.AggregateQL['aggregate'].totalCount;
                console.log(this.aggregate);
                this.syncHandicapWHS();
            }
        }
        this.showTable = Promise.resolve(true);
        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected contact when drawer closed
                //this.selectedContact = null;
                console.log(opened);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        //this.facadeService.findOne("-LeGr4seWAKipHNVKh_2").subscribe(result => this.myPlayer = result);
    }

    onBackdropClicked(): void {
        // Go back to the list
        this.location.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    updatePlayer(id: string): void {
        this.location.navigate(['./', id], {
            relativeTo: this._activatedRoute,
        });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    // onPageFired(event) {
    //     this.index = event.pageIndex * event.pageSize;
    //     this.pageSize = event.pageSize;
    //     console.log(this.index);

    //     // this.syncHandicapCongu();
    //     this.index = event.pageIndex * event.pageSize;
    //     this.syncHandicapWHS();

    //     console.log(event);
    // }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    syncHandicapWHS() {
        console.log(this.index);

      
        this.WHSSource = new MatTableDataSource(this.dataPlayers.player);
        this.WHSSource.paginator = this.paginator;
        this.WHSSource.sort = this.sort;
        this.isLoading = false;
        this.player = [];
    }
    public onSortChanged(e) {
        if (e.active == 'handicap') {
            this.sorting = e.direction;
        }
    }
    Comparatordsc(a, b) {
        let handicapA =
            a.handicapQL.length > 0
                ? a.handicapQL[a.handicapQL.length - 1].handicap
                : a.handicap;
        let handicapb =
            b.handicapQL.length > 0
                ? b.handicapQL[b.handicapQL.length - 1].handicap
                : b.handicap;
        if (handicapA > handicapb) return -1;
        if (handicapA < handicapb) return 1;

        return 0;
    }
    Comparatorasc(a, b) {
        let handicapA =
            a.handicapQL.length > 0
                ? a.handicapQL[a.handicapQL.length - 1].handicap
                : a.handicap;
        let handicapb =
            b.handicapQL.length > 0
                ? b.handicapQL[b.handicapQL.length - 1].handicap
                : b.handicap;
        if (handicapA < handicapb) return -1;
        if (handicapA > handicapb) return 1;

        return 0;
    }

    ComparatorascMember(a, b) {
        if (a['membershipNumber'] < b['membershipNumber']) return -1;
        if (a['membershipNumber'] > b['membershipNumber']) return 1;

        return 0;
    }
    redirectToHandicapDetails = (id: string) => {
        this.location.navigate(['./', id], {
            relativeTo: this._activatedRoute,
        });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    };
    public downloadAsPDFWHS() {
        var doc = new jsPDF();
        var col = ['Sr.', 'M.No', 'Name', 'Category', 'HandicapIndex'];
        var rows = [];
        doc.setFontSize(30);
        doc.text('WHS Handicap List', 15, 15);
        doc.setFontSize(15);
        doc.text('W.E.F:', 143, 15);
        doc.text(
            this.datepipe.transform(this.currentDate.toString(), 'MMM d, y'),
            160,
            15
        );
        doc.setFontSize(15);
        doc.setTextColor(100);

        let count = 0;
        this.dataPlayers.player.forEach((element) => {
            if (
                element.membershipNumber != null &&
                element.membershipNumber != '' &&
                (element.handicapWhsIndex != null || element.handicap > 0)
            ) {
                count++;
                var temp = [
                    count,
                    element.membershipNumber,
                    element.firstName + ' ' + element.lastName,
                    element.playerCategory,
                    element.handicapWhsIndex != null
                        ? element.handicapWhsIndex
                        : element.handicap,
                ];
                rows.push(temp);
            }
        });
        // From HTML
        doc.autoTable(col, rows, { startY: 25, theme: 'grid' });

        // Open PDF document in new tab
        doc.output('dataurlnewwindow');

        // Download PDF document
        //doc.save('flights.pdf');
    }

    getPlayerInformationByName(filterValue: string) {
        console.log(filterValue);
        if (filterValue == '') {
            this.syncHandicapWHS();
            return;
        }
        filterValue = filterValue.trim();
        // let firstName = filterValue.substr(0,filterValue.indexOf(' '));
        //  let secondName=filterValue.substr(filterValue.indexOf(' ')+1)
        //  console.log("firstname="+firstName);
        //  console.log("ScondName="+ secondName);

        filterValue = filterValue.toLowerCase();
        this.player = [];
        if (filterValue.length >= 3) {
            for (let c of this.dataPlayers.player) {
                c['fullname'] = c['firstName'] + ' ' + c['lastName'];
                if (c['fullname'].toLowerCase().includes(filterValue)) {
                    this.player.push(c);
                    //this.selectPlayer = c;
                }
            }
            console.log(this.player);
            this.setDataSource(this.player);
        }
    }

    async getPlayerInformationByMembershipNumber(filterValue: string) {
        console.log(filterValue);
        if (filterValue == '') {
            this.syncHandicapWHS();
            return;
        }
        filterValue = filterValue.trim();
        this.player = [];
        if (filterValue.length >= 2) {
            for (let c of this.dataPlayers.player) {
                if (c['membershipNumber'] == filterValue) {
                    this.player.push(c);
                    //this.selectPlayer = c;
                }
            }
            console.log(this.player);
            this.setDataSource(this.player);
        }
    }

    selectPlayer(player) {
        this.response = {
            player: player,
        };

        this.selectedRowIndex = player.id;
    }

    setDataSource(dataSource: Array<any>) {
        this.player = [];

        for (let obj of dataSource) {
            this.player.push(obj);
        }
        this.WHSSource = new MatTableDataSource(dataSource);
        this.WHSSource.sort = this.sort;
        console.log(this.WHSSource);

        //this.WHSSource = new MatTableDataSource(dataSource);
        //this.WHSSource.sort = this.sort;
        //console.log(this.WHSSource);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.WHSSource.filter = filterValue;

        if (this.WHSSource.paginator) {
            this.WHSSource.paginator.firstPage();
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
    applyWHSFilter(filterValue: string) {
        // filterValue = filterValue.trim(); // Remove whitespace
        // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        // this.WHSSource.filter = filterValue;

        // if (this.WHSSource.paginator) {
        //   this.WHSSource.paginator.firstPage();
        // }
        console.log(filterValue);
        if (filterValue == '') {
            this.syncHandicapWHS();
            return;
        }
        filterValue = filterValue.trim();
        // let firstName = filterValue.substr(0,filterValue.indexOf(' '));
        //  let secondName=filterValue.substr(filterValue.indexOf(' ')+1)
        //  console.log("firstname="+firstName);
        //  console.log("ScondName="+ secondName);

        filterValue = filterValue.toLowerCase();
        this.player = [];
        if (filterValue.length > 3) {
            for (let c of this.dataPlayers.player) {
                c['fullname'] = c['firstName'] + ' ' + c['lastName'];
                if (c['fullname'].toLowerCase().includes(filterValue)) {
                    this.player.push(c);
                    //this.selectPlayer = c;
                }
            }
            console.log(this.player);
            this.setDataSource(this.player);
        }
    }

    // async getClubMemberAggregateByCategroy(clubId: string) {
    //     let memberAggregate: any;
    //     let index: number = 0;
    //     const colors = ['navi', 'success', 'info', 'danger', 'purple', 'warn'];

    //     memberAggregate =
    //         await this._facadeService.getClubMemberAggregateByCategroy(clubId);
    //     //console.log(memberAggregate.club);
    //     //this.clubMemberAggregate = memberAggregate.club;

    //     for (var key of Object.keys(memberAggregate.club[0])) {
    //         //console.log(key + " -> ");
    //         //console.log(memberAggregate.club[0][key]);

    //         if (
    //             memberAggregate.club[0][key].aggregate &&
    //             memberAggregate.club[0][key].aggregate.count > 0
    //         ) {
    //             let info: any = {
    //                 title: `${key.replace('_', ' ')}`,
    //                 count: memberAggregate.club[0][key].aggregate.count,
    //                 class: 0,
    //             };

    //             this.totalMembers += info.count;

    //             this.clubMemberAggregate.push(info);

    //             index++;
    //             if (index > 5) index = 0;
    //         }
    //     }
    //     this.isLoading = false;
    //     console.log(this.clubMemberAggregate);
    // }

    // async getAllMemberAggregateByCategroy(clubId: string) {
    //     let memberAggregate: any;
    //     let index: number = 0;
    //     const colors = ['navi', 'success', 'info', 'danger', 'purple', 'warn'];

    //     //memberAggregate = await this.facadeService.getClubMemberAggregateByCategroy(clubId);
    //     memberAggregate = await this.facadeService.getAllPlayersByCategory();

    //     //this.clubMemberAggregate = memberAggregate.club;

    //     for (var key of Object.keys(memberAggregate)) {
    //         if (memberAggregate[key].length > 0) {
    //             let info: any = {
    //                 title: `${key}`,
    //                 count: memberAggregate[key].length,
    //                 class: colors[index],
    //             };

    //             this.totalMembers += info.count;

    //             this.clubMemberAggregate.push(info);

    //             index++;
    //             if (index > 5) index = 0;
    //         }
    //     }
    //     this.isLoading = false;
    //     //console.log(this.clubMemberAggregate);
    // }

    // async getSuperAdminStats() {
    //     let memberAggregate: any;
    //     let index: number = 0;
    //     const colors = ['navi', 'success', 'info', 'danger', 'purple', 'warn'];

    //     //memberAggregate = await this.facadeService.getClubMemberAggregateByCategroy(clubId);
    //     memberAggregate = await this.facadeService.getsuperAdminStats();
    //     //console.log(memberAggregate);

    //     //this.clubMemberAggregate = memberAggregate.club;

    //     for (var key of Object.keys(memberAggregate)) {
    //         //console.log(key + " -> ");
    //         //console.log(memberAggregate[key]);

    //         if (memberAggregate[key].length > 0) {
    //             let info: any = {
    //                 title: `${key}`.split('_').join(' '),
    //                 count: memberAggregate[key].length,
    //                 class: colors[index],
    //             };

    //             this.totalMembers += info.count;

    //             this.superAdminstats.push(info);

    //             index++;
    //             if (index > 5) index = 0;
    //         }
    //     }
    //     this.isLoading = false;
    //     //console.log(this.clubMemberAggregate);
    // }

    redirectToDetails = (id: string) => {
        console.log(id);

        this.location.navigate(['/players/view/' + id]);
    };

    showUserDetails(userDetails) {
        console.log(userDetails);

        // if (userDetails) {
        //     const dialogRef = this.dialog.open(UserDetailsDilogueComponent, {
        //         width: '600px',
        //         data: { userDetails },
        //     });
        //     console.log(userDetails);

        //     dialogRef.afterClosed().subscribe((result) => {
        //         if (result) {
        //             //console.log("record deleted.");
        //             //this.delete(id);
        //             //this.ngOnInit();
        //         } else {
        //             //console.log("cancel delete action");
        //         }
        //     });
        // }

        // this.facadeService.getPlayerByID(userDetails).then((response) => {
        //   console.log(response);
        // });
    }

    PlayerWHSDetails(userWHSDetailsDialogue) {
        console.log(userWHSDetailsDialogue);

        // if (userWHSDetailsDialogue) {
        //     const dialogRef = this.dialog.open(
        //         UserWHSDeatilsDialogueComponent,
        //         {
        //             width: '600px',
        //             data: { userWHSDetailsDialogue },
        //         }
        //     );
        //     console.log(userWHSDetailsDialogue);

        //     dialogRef.afterClosed().subscribe((result) => {
        //         if (result) {
        //             //console.log("record deleted.");
        //             //this.delete(id);
        //             //this.ngOnInit();
        //         } else {
        //             //console.log("cancel delete action");
        //         }
        //     });
        // }

        // this.facadeService.getPlayerByID(userDetails).then((response) => {
        //   console.log(response);
        // });
    }
}
