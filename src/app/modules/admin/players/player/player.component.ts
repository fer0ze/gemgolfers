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
import {
    Contact,
    Country,
    Tag,
} from 'app/modules/admin/players/player/player.types';
import { query } from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { UniqueIdGenerator } from '../../../../shared/classes/general';
import { ActivatedRoute, Router } from '@angular/router';

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
    //contacts$: Observable<Contact[]>;
    constructor(
        private _facadeService: FacadeService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {}
    ngOnInit(): void {
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
        let data = await this._facadeService.getPlayersListByClub(
            localStorage.getItem('adminClubID')
        );
        this.count = data.AggregateQL.aggregate.totalCount;
        console.log(data);
        this.playersDataSource = new MatTableDataSource(data.player);
        this.playersDataSource.paginator = this.paginator;
        this.playersDataSource.sort = this.sort;
    }

    /**
     * Create contact
     */
    createPlayer(): void {

        let id = UniqueIdGenerator.generate();

        this._router.navigate(['./', id], { relativeTo: this._activatedRoute });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    updatePlayer(id:string):void{
        this._router.navigate(['./', id], { relativeTo: this._activatedRoute });
        // });
        // Go to the new contact

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    viewProfile(id:string):void{
        console.log(id);
        
    }
}
