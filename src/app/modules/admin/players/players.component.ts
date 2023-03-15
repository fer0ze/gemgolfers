import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FacadeService } from 'app/shared/services/facade.service';
import { Subject, takeUntil, Observable, of } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';
import { query } from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';
import {
    Constants,
    UniqueIdGenerator,
} from '../../../shared/classes/general';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from 'app/shared/models/player.model';

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
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
        'Membership',
        'Category',
        'Handicap',
        'Status',
        'view',
        'Edit',
        // 'Delete',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    count: any = 0;
    showTable: Promise<any>;
    loggedInuser: Player;
    TablePlayers: any=[];
    //contacts$: Observable<Contact[]>;
    constructor(
        private _facadeService: FacadeService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        public snackBar: MatSnackBar
    ) {}
    ngOnInit(): void {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        this.fecthData();
        this.showTable = Promise.resolve(true);
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
                .pipe()
                .subscribe(
                    async (data) => {
                        data = await this._facadeService.getPlayersList();

                        // this.Players = dataPlayers.player;
                        // this.isLoading = false;

                        // this.dataSource = new MatTableDataSource(this.Players);
                        // this.dataSource.paginator = this.paginator;
                        // this.dataSource.sort = this.sort;
                        // console.log(this.Players);
                        this.count = data.player.length;
                        console.log(data);
                        this.Players = data.player;
                        for (let obj of this.Players) {
                            let newobj = {
                              id: obj.id,
                              Name: obj.firstName + " " + obj.lastName,
                              Phone: obj.phone,
                              Email: obj.email,
                              Membership: obj.membershipNumber,
                              Category: obj.playerCategory,
                              Handicap: obj.handicap,
                              Status:obj.membershipQL,
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
        } else {
            data = await this._facadeService.getPlayersListByClub(
                this.loggedInuser.adminClubId
            );
            this.count = data.player.length;
            this.Players = data.player;
            console.log(data);
            for (let obj of this.Players) {
                let newobj = {
                  id: obj.id,
                  Name: obj.firstName + " " + obj.lastName,
                  Phone: obj.phone,
                  Email: obj.email,
                  Membership: obj.membershipNumber,
                  Category: obj.playerCategory,
                  Handicap: obj.handicap,
                  Status:obj.membershipQL,
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
        console.log(index);

        let result = await this._facadeService.deletePlayer(
            player.homeClubId,
            player.id
        );
        if (result) {
            this.snackBar.open('Player has been deleted.', 'x', {
                duration: 5000,
            });
            this.playersDataSource.data.splice(index,1);

        }
    }
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['/players']);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    updatePlayer(id: string): void {
        this._router.navigate(['./view/', id], {
            relativeTo: this._activatedRoute,
        });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    viewProfile(id: string): void {
        this._router.navigate(['/players/viewProfile/' + id]);
    }

    downloadAllPlayers(): void {
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
        let count = 0;
        this.Players.forEach((element) => {
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
        doc.save('KGC-Gemgolfers-Players.pdf');
    }
}
