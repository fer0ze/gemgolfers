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
import { MatTableDataSource } from '@angular/material/table';
import { FacadeService } from 'app/shared/services/facade.service';
import { Subject, takeUntil, Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import "jspdf-autotable";
import * as jsPDF from "jspdf";
import {
    Contact,
    Country,
    Tag,
} from 'app/modules/admin/players/player/player.types';
import { query } from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { Constants, UniqueIdGenerator } from '../../../../shared/classes/general';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from 'app/shared/models/player.model';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    playersDataSource: MatTableDataSource<any>;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    displayNoRecords: boolean = true;
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    Players:any=[];
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
        'Delete',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    count: any = 0;
    showTable: Promise<any>;
    loggedInuser: Player;
    //contacts$: Observable<Contact[]>;
    constructor(
        private _facadeService: FacadeService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {}
    ngOnInit(): void {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        this.fecthData();
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
        let data = await this._facadeService.getPlayersListByClub(
            this.loggedInuser.adminClubId
        );
        this.count = data.AggregateQL.aggregate.totalCount;
        console.log(data);
        this.Players = data.player;
        this.playersDataSource = new MatTableDataSource(data.player);
        this.playersDataSource.paginator = this.paginator;
        this.playersDataSource.sort = this.sort;
    }

    /**
     * Create contact
     */
    createPlayer(): void {

        let id = UniqueIdGenerator.generate();

        this._router.navigate(['./view/', id], { relativeTo: this._activatedRoute });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['/players']);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    updatePlayer(id:string):void{
        this._router.navigate(['./view/', id], { relativeTo: this._activatedRoute });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    viewProfile(id:string):void{
        this._router.navigate(['/players/viewProfile/'+id])
        
    }

    downloadAllPlayers(): void {
        var doc = new jsPDF();
    
        var col = [
          "Sr.",
          "Name",
          "Phone",
          "Email",
          "Mem/No",
          "Category",
          "Handicap",
        ];
        var rows = [];
        doc.setFontSize(18);
        doc.text("Leaderboard Scores:", 15, 15);
        doc.setFontSize(11);
        doc.setTextColor(100);
        var count = 0;
        this.Players.forEach((element) => {
          count++;
          var temp = [
            count,
    
            element.firstName + " " + element.lastName,
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
          theme: "grid",
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
        doc.save("KGC-Gemgolfers-Players.pdf");
      }
}
