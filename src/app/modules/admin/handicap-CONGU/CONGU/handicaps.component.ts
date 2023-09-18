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
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';
@Component({
    selector: 'app-handicaps',
    templateUrl: './handicaps.component.html',
})
export class HandicapsComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    dataSource: MatTableDataSource<Player>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    displayedColumns = [
        'id',
        'name',
        'category',
        'handicap',
        'actualhandicap',
        'oldhandicap',
        'oldactualhandicap',
        'updatedAt',
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
        private logger: LogsService,
        private _activatedRoute: ActivatedRoute, private _localStorage: LocalStorageService,
    ) { }

    ngAfterViewInit(): void {
        //this.dataSource.sort = this.sort;
    }

    async ngOnInit() {
        try {

            this.logger.log('Admin Come to Congu Handicap Page', "info");
            this.currentDate = new Date();
            this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
            this.Players = [];

            this._router.paramMap.subscribe((params) => {
                this.filterCategory = params.get('category');
            });
            //console.log(this.filterCategory);

            this.MembersCat = this.filterCategory;
            console.log(this.MembersCat);
            if (this.loggedInuser.userRole > 1) {
                this.logger.log('Getting Congu Handicap Data', "info", this.loggedInuser.adminClubId);
                if (this.filterCategory)
                    this.dataPlayers =
                        await this._facadeService.getPlayersListByClubAndCategory(
                            this.loggedInuser.adminClubId,
                            General.capitalizeFirstLetter(this.filterCategory)
                        );
                else {
                    this.dataPlayers =
                        await this._facadeService.getPlayersListByClubCONGU(
                            this.loggedInuser.adminClubId
                        );
                    // this.aggregate =
                    //     this.dataPlayers.AggregateQL['aggregate'].totalCount;
                    console.log(this.aggregate);
                    this.syncHandicapCongu();
                }
            } else {
                this.logger.log('Getting Congu Handicap Data', "info", 'Super Admin');
                if (this.filterCategory)
                    this.dataPlayers =
                        await this._facadeService.getPlayerByCategory(
                            General.capitalizeFirstLetter(this.filterCategory)
                        );
                else {
                    this.dataPlayers =
                        await this._facadeService.getPlayersListByAdminCONGU();
                    console.log(this.dataPlayers);

                    // this.aggregate =
                    //     this.dataPlayers.AggregateQL['aggregate'].totalCount;
                    console.log(this.aggregate);
                    this.syncHandicapCongu();
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
        } catch (error) {
            this.logger.log('Getting All Congu Handicap Data Failed', "error", error.toString());
       
        }

        //this.fecthData();

        //this.facadeService.findOne("-LeGr4seWAKipHNVKh_2").subscribe(result => this.myPlayer = result);
    }

    onBackdropClicked(): void {
        // Go back to the list
        this.location.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    syncHandicapCongu() {
        console.log(this.dataPlayers.player);

        let count = 0;
        this.player = [];
        for (let obj of this.dataPlayers.player) {
            if (obj.handicapQL.length > 0 || obj.handicap > 0) {
                let newobj = {
                    id: obj.id,
                    name: obj.firstName + ' ' + obj.lastName,
                    phone: obj.phone,
                    email: obj.email,
                    membershipNumber: obj.membershipNumber,
                    category: obj.playerCategory,
                    handicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1].handicap
                            : obj.handicap,
                    oldhandicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1]
                                .oldHandicap
                            : obj.handicap,
                    oldactualhandicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1]
                                .oldHandicap
                            : obj.handicap,
                    updatedAt:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[
                                obj.handicapQL.length - 1
                            ].updatedAt.substring(0, 10)
                            : '',
                    actualhandicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1].handicap
                            : obj.handicap,
                };
                this.player.push(newobj);
            }
        }

        this.index = 0;

        console.log(this.player);

        this.dataSource = new MatTableDataSource(this.player);

        console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.player = [];
    }

    public onSortChanged(e) {
        if (e.active == 'handicap') {
            this.sorting = e.direction;
        }
    }
    public downloadAsPDFCongu() {
        try {
            
            this.logger.log('Download Handicap Congu Button Click', "info");
        let holeObj = document.getElementById('a');
        console.log(holeObj);

        let doc = new jsPDF();
        let res = doc.autoTableHtmlToJson(document.getElementById('a'));
        let columns = [
            res.columns[0],
            res.columns[1],
            res.columns[2],
            res.columns[3],
            res.columns[4],
            res.columns[5],
            res.columns[6],
            res.columns[7],
        ];

        let col = ['Sr.', 'M.No', 'Name', 'Exact H/C', 'Play H/C'];
        var rows = [];
        doc.setFontSize(30);
        doc.text('Congu Handicap List', 15, 15);
        doc.setFontSize(15);
        doc.text('W.E.F:', 143, 15);
        doc.text(
            this.datepipe.transform(this.currentDate.toString(), 'MMM d, y'),
            160,
            15
        );
        doc.setFontSize(15);
        doc.setTextColor(100);
        var sortarray = [...this.dataPlayers.player];
        // if (this.sorting == 'desc') {
        //     sortarray.sort(this.Comparatordsc);
        // } else if (this.sorting == 'asc') {
        //     sortarray.sort(this.Comparatorasc);
        // }
        console.log(this.dataPlayers);

        let count = 0;
        sortarray.forEach((element) => {
            if (
                element.membershipNumber != null &&
                element.membershipNumber != ''
            ) {
                if (
                    element.handicapQL.length > 0 ||
                    (element.playerCategory == 'Professionals' &&
                        element.handicapQL.length == 0) ||
                    element.handicapWhsIndex != null ||
                    (element.handicap != null && element.handicap > 0)
                ) {
                    count++;
                    let hand: any = element.handicap;
                    if (element.handicapQL.length > 0) {
                        if (
                            element.handicap !==
                            element.handicapQL[element.handicapQL.length - 1]
                                .handicap
                        ) {
                            hand = '*' + element.handicap;
                        }
                    }
                    var temp = [
                        count,
                        element.membershipNumber,
                        element.firstName + ' ' + element.lastName,
                        hand,
                        Math.round(element.handicap),
                    ];
                    rows.push(temp);
                }
            }
        });
        // From HTML
        doc.autoTable(col, rows, { startY: 25, theme: 'grid' });
        //  doc.autoTable(columns, res.data, { startY: 25, theme: "grid" });

        // Open PDF document in new tab
        doc.output('dataurlnewwindow');
    } catch (error) {
        this.logger.log('Downloading Congu Handicap Data Failed', "error", error.toString());
         
    }
        // Download PDF document
        //doc.save('flights.pdf');
    }

    redirectToHandicapDetails = (id: string) => {
        this.logger.log('View Player Handicap Congu Button Click', "info",id);
        this.location.navigate(['./', id], {
            relativeTo: this._activatedRoute,
        });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    };

    getPlayerInformationByName(filterValue: string) {
        this.logger.log('Search in Handicap Congu', "info",filterValue);
        console.log(filterValue);
        if (filterValue == '') {
            this.syncHandicapCongu();
            //this.syncHandicapWHS();
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
            this.syncHandicapCongu();
            //this.syncHandicapWHS();
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
        if (this.tabindex == 0) {
            for (let obj of dataSource) {
                let newobj = {
                    id: obj.id,
                    name: obj.firstName + ' ' + obj.lastName,
                    phone: obj.phone,
                    email: obj.email,
                    membershipNumber: obj.membershipNumber,
                    category: obj.playerCategory,
                    handicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1].handicap
                            : 0,
                    oldhandicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1]
                                .oldHandicap
                            : 0,
                    oldactualhandicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1]
                                .oldHandicap
                            : 0,
                    updatedAt:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[
                                obj.handicapQL.length - 1
                            ].updatedAt.substring(0, 10)
                            : '',
                    actualhandicap:
                        obj.handicapQL.length > 0
                            ? obj.handicapQL[obj.handicapQL.length - 1].handicap
                            : 0,
                };
                this.player.push(newobj);
            }
            this.dataSource = new MatTableDataSource(this.player);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log(this.dataSource);
        } else {
            //this.WHSSource = new MatTableDataSource(dataSource);
            //this.WHSSource.sort = this.sort;
            //console.log(this.WHSSource);
        }
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
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
}
