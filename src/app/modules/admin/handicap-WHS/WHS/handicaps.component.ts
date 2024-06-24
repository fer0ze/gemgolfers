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
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
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
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';
import { DialogTeeComponent } from '../../dialogs/dialog-tee-change/dialog-tee.component';
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
        'handicapChange',
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
    playerWHSRound: any;
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
        private _changeDetectorRef: ChangeDetectorRef, private logger: LogsService,
        private _activatedRoute: ActivatedRoute, private _localStorage: LocalStorageService
    ) { }

    ngAfterViewInit(): void {
        //this.dataSource.sort = this.sort;
    }

    async ngOnInit() {
        //this.fecthData();
        try {

            this.logger.log('Admin Come to WHS Handicap Page', "info");
            this.currentDate = new Date();
            this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
            this.Players = [];

            this._router.paramMap.subscribe((params) => {
                this.filterCategory = params.get('category');
            });
            //console.log(this.filterCategory);

            this.MembersCat = this.filterCategory;
            if (this.loggedInuser) {
                let club: any =
                    this.loggedInuser.membership.length > 0
                        ? this.loggedInuser.membership[0].club
                        : null;

                let courseID =
                    club != null ? club.courses[0].id : '-LUFS3FCQKOGpJ2IEHmf';
                let courseRating: any = {
                    courseId: courseID,
                    courseHoleSets: 3,
                };
                this.playerWHSRound = await this._facadeService.getPlayerWHSRound(
                    courseRating
                );
            }
            this.logger.log('Getting WHS Handicap Data', "info");
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
                    //console.log(this.aggregate);
                    this.syncHandicapWHS();

                    // this.WHSSource = new MatTableDataSource(this.HandicapIndex);
                    // //console.log(this.WHSSource);
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
                    //console.log(this.dataPlayers);

                    // this.aggregate =
                    //     this.dataPlayers.AggregateQL['aggregate'].totalCount;
                    //console.log(this.aggregate);
                    this.syncHandicapWHS();
                }
            }
            this.showTable = Promise.resolve(true);
            // Subscribe to MatDrawer opened change
            this.matDrawer.openedChange.subscribe((opened) => {
                if (!opened) {
                    // Remove the selected contact when drawer closed
                    //this.selectedContact = null;
                    //console.log(opened);

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
        } catch (error) {
            this.logger.log('Getting All WHS Handicap Data Failed', "error", error.toString());

        }
        //this.facadeService.findOne("-LeGr4seWAKipHNVKh_2").subscribe(result => this.myPlayer = result);
    }

    onBackdropClicked(): void {
        // Go back to the list
        this.location.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    updatePlayer(id: string): void {
        this.logger.log('View Player Handicap WHS Button Click', "info", id);

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
    //     //console.log(this.index);

    //     // this.syncHandicapCongu();
    //     this.index = event.pageIndex * event.pageSize;
    //     this.syncHandicapWHS();

    //     //console.log(event);
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
        //console.log(this.index);

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
        try {

            this.logger.log('Download Handicap WHS Button Click', "info");
            var doc = new jsPDF();
            var col = [
                'Sr.',
                'M.No',
                'Name',
                'Category',
                'Handicap Index',
                'Blue Tee',
                'White Tee',
                'Yellow Tee',
                'Black Tee',
                'Red Tee'
            ];
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
                    let handicapIndex =
                        element.handicapWhsIndex != null
                            ? element.handicapWhsIndex
                            : element.handicap;
                    let ratings = this.getTeesRating(handicapIndex);
                    var temp = [
                        count,
                        element.membershipNumber,
                        element.firstName + ' ' + element.lastName,
                        element.playerCategory,
                        element.handicapWhsIndex != null
                            ? element.handicapWhsIndex.toFixed(1)
                            : element.handicap.toFixed(1),
                        ratings['BLACK'],//blue
                        ratings['BLUE'],//white
                        ratings['WHITE'],//yellow
                        ratings['Black-Veterans'],//Balck
                        ratings['RED'],//red
                    ];
                    rows.push(temp);
                }
            });
            // From HTML
            var columnStyles = {
                4: { // Adjusting the width of the "Handicap Index" column (index starts from 1)
                    cellWidth: 20, // Adjust the width as needed
                },
            };
            // From HTML
            doc.autoTable({
                head: [col],
                body: rows,
                startY: 25,
                theme: 'grid',
                columnStyles: columnStyles,
            });

            // Open PDF document in new tab
            //doc.output('dataurlnewwindow');

            // Download PDF document
            doc.save('WHS.pdf');
        } catch (error) {
            this.logger.log('Downloading WHS Handicap Data Failed', "error", error.toString());

        }
    }

    getPlayerInformationByName(filterValue: string) {
        //console.log(filterValue);
        this.logger.log('Search in Handicap WHS', "info", filterValue);
        if (filterValue == '') {
            this.syncHandicapWHS();
            return;
        }
        filterValue = filterValue.trim();
        // let firstName = filterValue.substr(0,filterValue.indexOf(' '));
        //  let secondName=filterValue.substr(filterValue.indexOf(' ')+1)
        //  //console.log("firstname="+firstName);
        //  //console.log("ScondName="+ secondName);

        filterValue = filterValue.toLowerCase();
        this.player = [];
        if (filterValue.length >= 3) {
            for (let c of this.dataPlayers.player) {
                c['fullname'] = c['firstName'] + ' ' + c['lastName'];
                if (c['fullname'].toLowerCase().includes(filterValue)) {
                    this.player.push(c);
                    //this.selectPlayer = c;
                }
                if (c['membershipNumber'] == filterValue) {
                    this.player.push(c);
                }
            }
            //console.log(this.player);
            this.setDataSource(this.player);
        }
    }

    async getPlayerInformationByMembershipNumber(filterValue: string) {
        //console.log(filterValue);
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
            //console.log(this.player);
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
        //console.log(this.WHSSource);

        //this.WHSSource = new MatTableDataSource(dataSource);
        //this.WHSSource.sort = this.sort;
        ////console.log(this.WHSSource);
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
        //console.log(filterValue);
        if (filterValue == '') {
            this.syncHandicapWHS();
            return;
        }
        filterValue = filterValue.trim();
        // let firstName = filterValue.substr(0,filterValue.indexOf(' '));
        //  let secondName=filterValue.substr(filterValue.indexOf(' ')+1)
        //  //console.log("firstname="+firstName);
        //  //console.log("ScondName="+ secondName);

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
            //console.log(this.player);
            this.setDataSource(this.player);
        }
    }

    redirectToDetails = (id: string) => {
        //console.log(id);

        this.location.navigate(['/players/view/' + id]);
    };
    getTeesRating(handicapIndex) {
        let rating = this.playerWHSRound['course_rating'];
        let teeRatings = {}; // Object to store handicap index for each tee

        for (let item of rating) {
            let slopeRating = item['slopeRating'];
            let courseRating = item['courseRating'];
            let coursePar = item['coursePar'];
            if (item['tee'] == 'WHITE') {
                let whiteTeeHI =
                    (handicapIndex * (slopeRating / 113.0) +
                        (courseRating - coursePar)) *
                    0.95;
                whiteTeeHI = Math.round(whiteTeeHI);
                teeRatings['WHITE'] = whiteTeeHI; // Store white tee handicap index
            } else if (item['tee'] == 'BLACK') {
                let blackTeeHI =
                    (handicapIndex * (slopeRating / 113.0) +
                        (courseRating - coursePar)) *
                    0.95;
                blackTeeHI = Math.round(blackTeeHI);
                teeRatings['BLACK'] = blackTeeHI; // Store black tee handicap index
            } else if (item['tee'] == 'BLUE') {
                let blueTeeHI =
                    (handicapIndex * (slopeRating / 113.0) +
                        (courseRating - coursePar)) *
                    0.95;
                blueTeeHI = Math.round(blueTeeHI);
                teeRatings['BLUE'] = blueTeeHI; // Store blue tee handicap index
            } else if (item['tee'] == 'RED') {
                let redTeeHI =
                    (handicapIndex * (slopeRating / 113.0) +
                        (courseRating - coursePar)) *
                    0.95;
                redTeeHI = Math.round(redTeeHI);
                teeRatings['RED'] = redTeeHI; // Store red tee handicap index
            } else if (item['tee'] == 'Black') {
                let BlackTeeHI =
                    (handicapIndex * (slopeRating / 113.0) +
                        (courseRating - coursePar)) *
                    0.95;
                BlackTeeHI = Math.round(BlackTeeHI);
                teeRatings['Black-Veterans'] = BlackTeeHI; // Store black(veterans) tee handicap index
            }
        }

        return teeRatings; // Return object containing handicap index for each tee
    }

    openTeeChangeDailog(player) {
        // console.log(player);

        const dialogRef = this.dialog.open(DialogTeeComponent, {
            data: {
                player: player,
                loggedInUser: this.loggedInuser
            }
        });
    }

}
