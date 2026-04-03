import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { FacadeService } from 'app/shared/services/facade.service';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { DialogOverviewComponent } from '../../dialogs/dialog-overview/dialog-overview.component';

@Component({
    standalone: false,
    selector: 'app-clubs-list',
    templateUrl: './clubs-list.component.html',
})
export class ClubsListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    displayedColumns: string[] = ['index', 'name', 'email', 'phone', 'address', 'members', 'courses', 'actions'];
    searchControl: UntypedFormControl = new UntypedFormControl('');
    isLoading: boolean = true;
    allClubs: any[] = [];

    constructor(
        private facadeService: FacadeService,
        private _localStorage: LocalStorageService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.loadClubs();
        this.searchControl.valueChanges.subscribe(val => {
            this.dataSource.filter = (val || '').trim().toLowerCase();
        });
    }

    async loadClubs(): Promise<void> {
        this.isLoading = true;
        try {
            const result = await this.facadeService.getClubList();
            this.allClubs = result?.club || [];
            this.dataSource = new MatTableDataSource(this.allClubs);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = (data: any, filter: string) =>
                (data.name || '').toLowerCase().includes(filter) ||
                (data.email || '').toLowerCase().includes(filter) ||
                (data.address || '').toLowerCase().includes(filter);
        } catch (err) {
            this.snackBar.open('Failed to load clubs.', 'x', { duration: 3000 });
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    addClub(): void {
        this.router.navigate(['/clubs/add']);
    }

    viewClub(club: any): void {
        this.router.navigate(['/clubs/view', club.id]);
    }

    editClub(club: any): void {
        this.router.navigate(['/clubs/edit', club.id]);
    }

    deleteClub(club: any): void {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '400px',
            data: `Are you sure you want to delete club "${club.name}"? This action cannot be undone.`,
        });

        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (confirmed) {
                const success = await this.facadeService.deleteClub(club.id);
                if (success) {
                    this.snackBar.open('Club deleted successfully.', 'x', { duration: 3000 });
                    this.loadClubs();
                } else {
                    this.snackBar.open('Failed to delete club. It may have associated data.', 'x', { duration: 4000 });
                }
            }
        });
    }

    get isSuperAdmin(): boolean {
        return this._localStorage.isSuperAdmin();
    }
}
