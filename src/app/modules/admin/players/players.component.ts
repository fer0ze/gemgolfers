import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterViewInit,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FacadeService } from 'app/shared/services/facade.service';
import { Subject, takeUntil, Observable, of, switchMap } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { query } from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';
import {
    Constants,
    UniqueIdGenerator,
    generateGemId,
} from '../../../shared/classes/general';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubMembership, Player } from 'app/shared/models/player.model';
import { read, utils } from 'xlsx';
import { HandicapService } from 'app/shared/services/handicap.service';
import { DialogOverviewComponent } from '../dialogs/dialog-overview/dialog-overview.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('event') aName: ElementRef;
    drawerMode: 'side' | 'over';
    playersDataSource: MatTableDataSource<any>;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    displayNoRecords: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    Players: any = [];
    playersTableColumns: string[] = [
        'Sr',
        'Name',
        'Phone',
        'Email',
        'MembershipNo',
        'Category',
        'Handicap',
        'club',
        'createdAt',
        'Status',
        'view',
        'Edit',
        'Delete',
    ];
    tourID: string = '';
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    count: any = 0;
    showTable: Promise<any>;
    loggedInuser: Player;
    TablePlayers: any = [];
    sorting: any = '';
    public name: any = '';
    file: File;
    arrayBuffer: any;
    playersData: any;
    savePlayers: any[] = [];

    duplicatePlayers: any[] = [];
    importingList = false;
    @ViewChild('fileInput') fileInputVariable: ElementRef;
    //contacts$: Observable<Contact[]>;
    constructor(
        private _facadeService: FacadeService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        public snackBar: MatSnackBar,
        private _handicapServise: HandicapService,
        public dialog: MatDialog,
        private _localStorage: LocalStorageService,
        private logger: LogsService
    ) { }
    ngOnInit(): void {
        try {
            this.logger.log('Admin comes to Players Page', "info");
            this.logger.log('Getting Players Data', "info");
            this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
            this.fecthData();
            this.showTable = Promise.resolve(true);
            this.logger.log('Getting Players Data SuccessFull', "info");
        } catch (error) {
            this.logger.log('Getting Players Data Failed', "error", error.toString());
        }


    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.playersDataSource.filter = filterValue;
        if (this.playersDataSource.filteredData.length == 0) {
            this.displayNoRecords = false;
        } else {
            this.displayNoRecords = true;
        }
    }

    async fecthData() {
        let data: any;
        if (this.loggedInuser.userRole == 1) {
            //data = await this._facadeService.getPlayersList();
            of(this.Players)
                .pipe(
                    switchMap(() => this._facadeService.getPlayersList())
                )
                .subscribe(
                    async (data) => {


                        // this.Players = dataPlayers.player;
                        // this.isLoading = false;

                        // this.dataSource = new MatTableDataSource(this.Players);
                        // this.dataSource.paginator = this.paginator;
                        // this.dataSource.sort = this.sort;
                        // //console.log(this.Players);
                        this.count = data.player.length;
                        //console.log(data);
                        this.Players = data.player;
                        for (let obj of this.Players) {
                            let Fname = obj.firstName
                                ? obj.firstName.trim()
                                : obj.firstName;
                            let Lname = obj.lastName
                                ? obj.lastName.trim()
                                : obj.lastName;
                            let newobj = {
                                id: obj.id,
                                Name: Fname + ' ' + Lname,
                                Phone: obj.phone,
                                Email: obj.email,
                                createdAt: obj.createdAt,
                                MembershipNo: obj.membershipNumber,
                                Category:
                                    obj.playerCategory == 'Senior'
                                        ? 'Senior Amateurs'
                                        : obj.playerCategory,
                                Handicap: obj.handicap,
                                Status: obj.membershipQL,
                                club: obj.membershipQL[0]?.club?.name ?? '-',
                            };
                            this.TablePlayers.push(newobj);
                        }
                        this.playersDataSource = new MatTableDataSource(
                            this.TablePlayers
                        );
                        this.playersDataSource.paginator = this.paginator;
                        this.playersDataSource.sort = this.sort;
                    },
                    (error) => console.log('error')
                );
        } else if (this.loggedInuser.userRole == 2) {
            data = await this._facadeService.getPlayersListByClub(
                this.loggedInuser.adminClubId
            );
            this.count = data.player.length;
            this.Players = data.player;
            //console.log(data);
            for (let obj of this.Players) {
                let Fname = obj.firstName
                    ? obj.firstName.trim()
                    : obj.firstName;
                let Lname = obj.lastName ? obj.lastName.trim() : obj.lastName;
                let newobj = {
                    id: obj.id,
                    Name: Fname + ' ' + Lname,
                    Phone: obj.phone,
                    Email: obj.email,
                    createdAt: obj.createdAt,
                    MembershipNo: obj.membershipNumber,
                    Category:
                        obj.playerCategory == 'Senior'
                            ? 'Senior Amateurs'
                            : obj.playerCategory,
                    Handicap: obj.handicap,
                    Status: obj.membershipQL,
                    club: obj.membershipQL[0]?.club?.name ?? '-',
                };
                this.TablePlayers.push(newobj);
            }

            this.playersDataSource = new MatTableDataSource(this.TablePlayers);
            this.playersDataSource.paginator = this.paginator;
            this.playersDataSource.sort = this.sort;
        } else if (this.loggedInuser.userRole == 4) {
            this.tourID = this._localStorage.get(Constants.TOUR_ID);
            data = await this._facadeService.getPlayersListByTour(
                this.tourID
            );
            //console.log(data);
            this.count = data.tour_member.length;
            this.Players = data.tour_member;
            for (let obj of this.Players) {
                let Fname = obj.player.firstName
                    ? obj.player.firstName.trim()
                    : obj.player.firstName;
                let Lname = obj.player.lastName ? obj.player.lastName.trim() : obj.player.lastName;
                let newobj = {
                    id: obj.player.id,
                    Name: Fname + ' ' + Lname,
                    Phone: obj.player.phone,
                    Email: obj.player.email,
                    createdAt: obj.player.createdAt,
                    MembershipNo: obj.player.membershipNumber,
                    Category:
                        obj.player.playerCategory == 'Senior'
                            ? 'Senior Amateurs'
                            : obj.player.playerCategory,
                    Handicap: obj.player.handicap,
                    Status: obj.player.membershipQL,
                    club: obj.player.membershipQL[0]?.club?.name ?? '-',
                };
                this.TablePlayers.push(newobj);
            }

            this.playersDataSource = new MatTableDataSource(this.TablePlayers);
            this.playersDataSource.paginator = this.paginator;
            this.playersDataSource.sort = this.sort;
        }
    }

    /**
     * Create contact
     */
    createPlayer(): void {
        // let id = UniqueIdGenerator.generate();

        this._router.navigate(['./add'], {
            relativeTo: this._activatedRoute,
        });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    async deletePlayer(player: any, index: any) {
        try {
            this.logger.log('Players Delete Dialog Open', "info", player.toString());
            const dialogRef = this.dialog.open(DialogOverviewComponent, {
                width: '350px',
                data: 'Do you want to delete the player?',
            });
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result) {
                    index = this.playersDataSource.data.findIndex(
                        (Player) => Player.id === player.id
                    );

                    let response = await this._facadeService.deletePlayer(
                        player.homeClubId,
                        player.id
                    );
                    if (response) {
                        if (index !== -1) {
                            this.snackBar.open('Player has been deleted.', 'x', {
                                duration: 5000,
                            });
                            this.playersDataSource.data.splice(index, 1);
                            this.playersDataSource._updateChangeSubscription();
                        }
                        this.logger.log('Players is Deleted', "info", player.toString());
                        // this._changeDetectorRef.markForCheck();
                    }
                }
            });
        } catch (error) {
            this.logger.log('Player Deleting Failed', "error", error.toString());
        }
    }
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['/players']);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    updatePlayer(id: string): void {
        this.logger.log('Players Edit Page Open', "info", id.toString());
        this._router.navigate(['./view/', id], {
            relativeTo: this._activatedRoute,
        });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    viewProfile(id: string): void {
        this.logger.log('Players View Profile Page Open', "info", id.toString());
        this._router.navigate(['/players/viewProfile/' + id]);
    }

    downloadAllPlayers(): void {
        try {
            this.logger.log('Download All Players Button Click', "info");
            let doc = new jsPDF();

            let col = [
                'Sr.',
                'Name',
                'Phone',
                'Email',
                'Mem/No',
                'Category',
                'Handicap',
            ];
            var rows = [];
            doc.setFontSize(18);
            doc.text('Leaderboard Scores:', 15, 15);
            doc.setFontSize(11);
            doc.setTextColor(100);
            var sortarray = [...this.Players];
            if (this.sorting == 'desc') {
                if (this.name == 'Name') {
                    sortarray.sort(this.ComparatordscN);
                } else if (this.name == 'Email') {
                    sortarray.sort(this.ComparatordscE);
                } else if (this.name == 'Membership') {
                    sortarray.sort(this.ComparatordscM);
                } else if (this.name == 'Category') {
                    sortarray.sort(this.ComparatordscC);
                } else if (this.name == 'Handicap') {
                    sortarray.sort(this.ComparatordscH);
                }
            } else if (this.sorting == 'asc') {
                if (this.name == 'Name') {
                    sortarray.sort(this.ComparatorascN);
                } else if (this.name == 'Email') {
                    sortarray.sort(this.ComparatorascE);
                } else if (this.name == 'Membership') {
                    sortarray.sort(this.ComparatorascM);
                } else if (this.name == 'Category') {
                    sortarray.sort(this.ComparatorascC);
                } else if (this.name == 'Handicap') {
                    sortarray.sort(this.ComparatorascH);
                }
            }
            let count = 0;
            sortarray.forEach((element) => {
                count++;
                var temp = [
                    count,

                    element.firstName + ' ' + element.lastName,
                    element.phone,
                    element.email,
                    element.membershipNumber,
                    element.playerCategory,
                    element.handicap,
                ];
                rows.push(temp);
            });
            // From HTML
            doc.autoTable(col, rows, {
                startY: 25,
                theme: 'grid',
                columnStyles: {
                    0: { cellWidth: 12 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 45 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 30 },
                    6: { cellWidth: 20 },

                    // etc
                },
            });

            // Open PDF document in new tab
            doc.save('Club-Players.pdf');
            this.logger.log('Downloading All Players Successfully', "info");
        } catch (error) {
            this.logger.log('Download All Players Function Failed', "error", error.toString());
        }

    }

    exportToExcel(): void {

        const data = this.playersDataSource.data.map((item) => {
            // Create a new object without the 'Details' column
            const { id, Status, Sr, view, Edit, Delete, ...filteredItem } = item;
            return filteredItem;
        });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        // Export the Excel file
        XLSX.writeFile(wb, 'Players_report.xlsx');

    }
    public onSortChanged(e) {
        this.sorting = e.direction;
        this.name = e.active;
        this.logger.log('Sorting Function Click on Players Table', "info", this.name);
    }

    public ComparatordscN(a, b) {
        if (a['firstName'] > b['firstName']) return -1;
        if (a['firstName'] < b['firstName']) return 1;

        return 0;
    }
    public ComparatorascN(a, b) {
        if (a['firstName'] < b['firstName']) return -1;
        if (a['firstName'] > b['firstName']) return 1;

        return 0;
    }
    public ComparatordscE(a, b) {
        if (a['email'] > b['email']) return -1;
        if (a['email'] < b['email']) return 1;

        return 0;
    }
    public ComparatorascE(a, b) {
        if (a['email'] < b['email']) return -1;
        if (a['email'] > b['email']) return 1;

        return 0;
    }
    public ComparatordscM(a, b) {
        if (a['membershipNumber'] > b['membershipNumber']) return -1;
        if (a['membershipNumber'] < b['membershipNumber']) return 1;

        return 0;
    }
    public ComparatorascM(a, b) {
        if (a['membershipNumber'] < b['membershipNumber']) return -1;
        if (a['membershipNumber'] > b['membershipNumber']) return 1;

        return 0;
    }
    public ComparatordscC(a, b) {
        if (a['playerCategory'] > b['playerCategory']) return -1;
        if (a['playerCategory'] < b['playerCategory']) return 1;

        return 0;
    }
    public ComparatorascC(a, b) {
        if (a['playerCategory'] < b['playerCategory']) return -1;
        if (a['playerCategory'] > b['playerCategory']) return 1;

        return 0;
    }
    public ComparatordscH(a, b) {
        if (a['handicap'] > b['handicap']) return -1;
        if (a['handicap'] < b['handicap']) return 1;

        return 0;
    }
    public ComparatorascH(a, b) {
        if (a['handicap'] < b['handicap']) return -1;
        if (a['handicap'] > b['handicap']) return 1;

        return 0;
    }
    onFileChange(event) {
        // this.logger.log(this.file);
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
            // this.logger.log(this.file);
        }
    }

    parseFlightsData() {
        let fileReader = new FileReader();
        this.playersData = [];

        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i)
                arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join('');
            var workbook = read(bstr, { type: 'binary' });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.playersData = utils.sheet_to_json(worksheet, {
                raw: true,
                defval: '',
            });

            // this.logger.log(this.playersData);
            //console.log(this.playersData);

            this.importExcelData();
            //this.providerservice.importexcel(this.exceljsondata).subscribe(data=>{
            //})
        };
        fileReader.readAsArrayBuffer(this.file);
    }

    async importExcelData() {
        try {
            this.importingList = true;

            this.savePlayers = [];
            this.duplicatePlayers = [];
            let clubMember: ClubMembership[] = [];

            // for (let p of this.playersData) {
            //   // this.logger.logObject(p);
            //   console.log(p);

            //   let exist: any = [];

            //   if (p.membershipNumber) {
            //     // this.logger.log(p.membershipNumber);
            //     console.log(p.membershipNumber);

            //     exist = await this.facadeService.getPlayerByMembershipNumber(
            //       p.membershipNumber.toString()
            //     );

            //     if (exist.length > 0) {
            //       if (exist[0].handicapQL.length > 0) {
            //         let handicapHistory = exist[0].handicapQL;
            //         let lastTournamentID =
            //           handicapHistory[handicapHistory.length - 1].tournamentId;
            //         console.log(lastTournamentID);

            //         const handicapChangeLog =
            //           await this.facadeService.updateLastHandicap(
            //             exist[0].id,
            //             lastTournamentID,
            //             p.handicap
            //           );
            //         console.log(handicapChangeLog);
            //       }

            //       let succes = await this.facadeService.updatePlayerHandicap(
            //         exist[0].id,
            //         p.handicap
            //       );

            //       this.duplicatePlayers.push(exist);
            //       //continue;
            //     }
            //   }
            // }
            // console.log(this.duplicatePlayers);

            for (let p of this.playersData) {
                // this.logger.logObject(p);
                console.log(p);

                let exist: any = [];

                // if (p.membershipNumber) {
                //     // this.logger.log(p.membershipNumber);
                //     console.log(p.membershipNumber);

                //     exist = await this.facadeService.getPlayerByMembershipNumber(
                //         p.membershipNumber.toString()
                //     );

                //     if (exist.length > 0) {
                //         this.duplicatePlayers.push(p);
                //         //continue;
                //     }
                // }

                // if (p.phone && exist.length == 0) {
                //     // this.logger.log(p.phone);
                //     console.log(p.phone);
                //     let phone;
                //     if (p.phone.toString().indexOf("+92") === 0) {
                //         phone = p.phone.toString();
                //     } else if (p.phone.toString().indexOf("0") === 0) {
                //         phone = p.phone.toString().replace(0, "+92");
                //     } else if (p.phone.toString().indexOf("3") === 0) {
                //         phone = "+92" + p.phone.toString();
                //     }
                //     console.log(phone);

                //     exist = await this.facadeService.getPlayerByPhone(phone);
                //     // p.phone.toString().indexOf("+") !== -1
                //     // ? p.phone.toString()
                //     // : "+" + p.phone.toString()
                //     if (exist.length > 0) {
                //         this.duplicatePlayers.push(p);
                //         //continue;
                //     }
                // }

                // if (p.email && exist.length == 0) {
                //     exist = await this.facadeService.getPlayerByEmail(p.email.toString());

                //     if (exist.length > 0) {
                //         // this.logger.log("email yes");
                //         console.log("email Yes");

                //         this.duplicatePlayers.push(p);
                //         //continue;
                //     }
                // }

                // this.logger.log(exist);
                console.log(exist);

                let UniqueId: string =
                    exist && exist.length > 0
                        ? exist[0].id
                        : UniqueIdGenerator.generate();

                //if(p.club) {

                let member: any = {
                    clubId: this.loggedInuser.adminClubId,
                    playerId: UniqueId,
                };

                clubMember.push(member);
                //}

                let player: any = {
                    id: UniqueId,
                    adminClubId: null,
                    firebaseUid: null,
                    fcmToken: null,
                    gemId: generateGemId.generate(UniqueId),
                    firstName: p.firstName,
                    lastName: p.lastName,
                    gender: p.gender ? p.gender : null,
                    dob: p.dob ? p.dob : null,
                    picture: p.picture ? p.picture : null,
                    email: p.email ? p.email : null,
                    phone: p.phone ? p.phone : null,
                    playerCategory: p.category ? p.category : null,
                    handicap: p.handicap ? p.handicap : 0,
                    online: false,
                    countryCode: p.code ? p.code : null,
                    extraData: p.extra ? p.extra : null,
                    membershipNumber: null,
                    userRole: 3,
                    membership: null,
                };

                this.savePlayers.push(player);
            }

            // this.logger.log(this.savePlayers);
            // this.logger.log(this.duplicatePlayers);
            console.log(this.savePlayers);

            let status = await this._facadeService.importPlayerList(
                this.savePlayers,
                clubMember
            );

            if (status) {
                let newProfiles =
                    Number(this.savePlayers.length) -
                    Number(this.duplicatePlayers.length);
                this.snackBar.open(
                    (newProfiles < 0 ? 0 : newProfiles) +
                    " players have been created. " +
                    this.duplicatePlayers.length +
                    " player(s) were already exist.",
                    "x",
                    {
                        duration: 5000,
                    }
                );

                this.importingList = false;
                this.file = null;
                this.fileInputVariable.nativeElement.value = "";

                await this.delay(5000);
                //window.location.reload();
            } else {
                this.snackBar.open("There was an Error while loading file", "x", {
                    duration: 3000,
                });
                this.importingList = false;
            }
        } catch {
            this.importingList = false;
        }
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
