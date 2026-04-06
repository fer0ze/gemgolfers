import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FacadeService } from 'app/shared/services/facade.service';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { DialogOverviewComponent } from '../../dialogs/dialog-overview/dialog-overview.component';

@Component({
    standalone: false,
    selector: 'app-clubs-list',
    templateUrl: './clubs-list.component.html',
})
export class ClubsListComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    displayedColumns: string[] = ['index', 'name', 'email', 'phone', 'members', 'courses', 'actions'];
    searchControl: UntypedFormControl = new UntypedFormControl('');
    isLoading: boolean = true;

    totalCount: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;

    brokenLogos = new Set<string>();

    private destroy$ = new Subject<void>();

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
        this.searchControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
                this.pageIndex = 0;
                this.loadClubs();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async loadClubs(): Promise<void> {
        this.isLoading = true;
        const search = (this.searchControl.value || '').trim();
        try {
            const result = await this.facadeService.getClubsPaginated(
                this.pageSize,
                this.pageIndex * this.pageSize,
                search,
            );
            const clubs = result?.club || [];
            this.totalCount = result?.club_aggregate?.aggregate?.count || 0;
            this.dataSource = new MatTableDataSource(clubs);
        } catch (err) {
            this.snackBar.open('Failed to load clubs.', 'x', { duration: 3000 });
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadClubs();
    }

    hasLogo(club: any): boolean {
        return !!club.logo && !this.brokenLogos.has(club.id);
    }

    onLogoError(clubId: string): void {
        this.brokenLogos.add(clubId);
        this.cdr.detectChanges();
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
