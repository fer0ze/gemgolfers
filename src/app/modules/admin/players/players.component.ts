import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacadeService } from 'app/shared/services/facade.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { MatDrawer } from '@angular/material/sidenav';
import { Constants, UniqueIdGenerator, generateGemId } from '../../../shared/classes/general';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubMembership, Player, UserSessionModel } from 'app/shared/models/player.model';
import { read, utils } from 'xlsx';
import { HandicapService } from 'app/shared/services/handicap.service';
import { DialogOverviewComponent } from '../dialogs/dialog-overview/dialog-overview.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';
import { SelectionModel } from '@angular/cdk/collections';

const CATEGORIES = [
    'Amateurs',
    'Senior Amateurs',
    'Veterans',
    'Junior Amateurs',
    'Ladies',
    'Professionals',
    'Senior Professionals',
    'Caddie',
];

@Component({
    standalone: false,
    selector: 'app-players',
    templateUrl: './players.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('fileInput') fileInputVariable: ElementRef;

    drawerMode: 'side' | 'over';

    // ── Table data ─────────────────────────────────────────────────────────────
    players: any[] = [];
    totalCount: number = 0;
    isLoading: boolean = false;

    playersTableColumns: string[] = [
        'id', 'Name', 'Phone', 'Email', 'MembershipNo',
        'Category', 'Handicap', 'club', 'createdAt', 'view', 'Edit', 'Delete',
    ];

    // ── Pagination ─────────────────────────────────────────────────────────────
    pageSize: number = 25;
    pageIndex: number = 0;

    // ── Filters ────────────────────────────────────────────────────────────────
    searchInputControl: UntypedFormControl = new UntypedFormControl('');
    selectedCategory: string = '';
    selectedClubSearch: string = '';
    readonly categories = CATEGORIES;

    // ── Selection (bulk ops) ───────────────────────────────────────────────────
    selection = new SelectionModel<any>(true, []);

    // ── Role / user session ────────────────────────────────────────────────────
    loggedInuser: UserSessionModel;
    tourID: string = '';
    isSuperAdmin: boolean = false;
    isClubAdmin: boolean = false;

    // ── Excel import ───────────────────────────────────────────────────────────
    file: File;
    arrayBuffer: any;
    playersData: any;
    savePlayers: any[] = [];
    duplicatePlayers: any[] = [];
    importingList = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _facadeService: FacadeService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        public snackBar: MatSnackBar,
        private _handicapServise: HandicapService,
        public dialog: MatDialog,
        public _localStorage: LocalStorageService,
        private logger: LogsService,
    ) {}

    ngOnInit(): void {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        this.isSuperAdmin = this._localStorage.isSuperAdmin();
        this.isClubAdmin = this._localStorage.isClubAdmin();

        // For TourAdmin/LeagueAdmin keep old path
        if (!this.isSuperAdmin && !this.isClubAdmin) {
            this.fetchLegacyData();
            return;
        }

        this.loadPlayers();

        // Debounced search
        this.searchInputControl.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(400),
            distinctUntilChanged(),
        ).subscribe(() => {
            this.pageIndex = 0;
            this.loadPlayers();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // ── Data loading ───────────────────────────────────────────────────────────

    async loadPlayers(): Promise<void> {
        this.isLoading = true;
        this._changeDetectorRef.markForCheck();
        try {
            const where = this.buildWhere();
            const result = await this._facadeService.getPlayersPaginated(
                where, this.pageSize, this.pageIndex * this.pageSize,
            );
            this.totalCount = result?.player_aggregate?.aggregate?.count || 0;
            this.players = (result?.player || []).map((p: any) => ({
                id: p.id,
                Name: ((p.firstName || '').trim() + ' ' + (p.lastName || '').trim()).trim(),
                Phone: p.phone,
                Email: p.email,
                createdAt: p.createdAt,
                MembershipNo: p.membershipNumber,
                Category: p.playerCategory === 'Senior' ? 'Senior Amateurs' : p.playerCategory,
                Handicap: p.handicap,
                club: p.membershipQL?.[0]?.club?.name ?? '—',
                homeClubId: p.membershipQL?.[0]?.clubId,
            }));
            this.selection.clear();
        } catch (err) {
            console.error(err);
        } finally {
            this.isLoading = false;
            this._changeDetectorRef.markForCheck();
        }
    }

    private buildWhere(): any {
        const conditions: any[] = [];

        // ClubAdmin is always restricted to their club
        if (this.isClubAdmin) {
            conditions.push({ membership: { clubId: { _eq: this.loggedInuser.adminClubId } } });
        }

        // Search across name, email, membership number
        const search = (this.searchInputControl.value || '').trim();
        if (search) {
            const s = `%${search}%`;
            conditions.push({
                _or: [
                    { firstName: { _ilike: s } },
                    { lastName: { _ilike: s } },
                    { email: { _ilike: s } },
                    { membershipNumber: { _ilike: s } },
                ],
            });
        }

        // Category filter
        if (this.selectedCategory) {
            conditions.push({ playerCategory: { _eq: this.selectedCategory } });
        }

        // SuperAdmin: optional club name search
        if (this.isSuperAdmin && this.selectedClubSearch?.trim()) {
            conditions.push({
                membership: { club: { name: { _ilike: `%${this.selectedClubSearch.trim()}%` } } },
            });
        }

        return conditions.length > 0 ? { _and: conditions } : {};
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadPlayers();
    }

    applyCategory(category: string): void {
        this.selectedCategory = category;
        this.pageIndex = 0;
        this.loadPlayers();
    }

    applyClubSearch(): void {
        this.pageIndex = 0;
        this.loadPlayers();
    }

    clearFilters(): void {
        this.searchInputControl.setValue('', { emitEvent: false });
        this.selectedCategory = '';
        this.selectedClubSearch = '';
        this.pageIndex = 0;
        this.loadPlayers();
    }

    get hasActiveFilters(): boolean {
        return !!(
            (this.searchInputControl.value || '').trim() ||
            this.selectedCategory ||
            this.selectedClubSearch
        );
    }

    // ── Legacy path (TourAdmin / LeagueAdmin) ──────────────────────────────────

    async fetchLegacyData(): Promise<void> {
        this.isLoading = true;
        this._changeDetectorRef.markForCheck();
        let legacyPlayers: any[] = [];
        try {
            let state = this._localStorage.get(Constants.STATE);
            if (state === Constants.TOUR) {
                this.tourID = this._localStorage.get(Constants.TOUR_ID);
                const data = await this._facadeService.getPlayersListByTour(this.tourID);
                legacyPlayers = (data?.tour_member || []).map((obj: any) => ({
                    id: obj.player.id,
                    Name: ((obj.player.firstName || '').trim() + ' ' + (obj.player.lastName || '').trim()).trim(),
                    Phone: obj.player.phone,
                    Email: obj.player.email,
                    createdAt: obj.player.createdAt,
                    MembershipNo: obj.player.membershipNumber,
                    Category: obj.player.playerCategory === 'Senior' ? 'Senior Amateurs' : obj.player.playerCategory,
                    Handicap: obj.player.handicap,
                    club: '—',
                }));
                this.totalCount = legacyPlayers.length;
            } else if (state === Constants.LEAGUE) {
                this.tourID = this._localStorage.get(Constants.LEAGUE_ID);
                const data = await this._facadeService.getPlayersListByLeague(this.tourID);
                legacyPlayers = (data?.league_member || []).map((obj: any) => ({
                    id: obj.player.id,
                    Name: ((obj.player.firstName || '').trim() + ' ' + (obj.player.lastName || '').trim()).trim(),
                    Phone: obj.player.phone,
                    Email: obj.player.email,
                    createdAt: obj.player.createdAt,
                    MembershipNo: obj.player.membershipNumber,
                    Category: obj.player.playerCategory === 'Senior' ? 'Senior Amateurs' : obj.player.playerCategory,
                    Handicap: obj.player.handicap,
                    club: '—',
                }));
                this.totalCount = legacyPlayers.length;
            }
        } catch (err) {
            console.error(err);
        } finally {
            this.players = legacyPlayers;
            this.isLoading = false;
            this._changeDetectorRef.markForCheck();
        }
    }

    // ── Table actions ──────────────────────────────────────────────────────────

    createPlayer(): void {
        this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
    }

    updatePlayer(id: string): void {
        this._router.navigate(['./view/', id], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
    }

    viewProfile(id: string): void {
        this._router.navigate(['/players/viewProfile/' + id]);
    }

    async deletePlayer(player: any): Promise<void> {
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '350px',
            data: 'Do you want to delete the player?',
        });
        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (confirmed) {
                const response = await this._facadeService.deletePlayer(player.homeClubId, player.id);
                if (response) {
                    this.snackBar.open('Player has been deleted.', 'x', { duration: 5000 });
                    this.loadPlayers();
                }
            }
        });
    }

    // ── Selection ──────────────────────────────────────────────────────────────

    isAllSelected(): boolean {
        return this.players.length > 0 &&
            this.selection.selected.length === this.players.length;
    }

    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.players.forEach(row => this.selection.select(row));
        }
    }

    checkboxLabel(row?: any): string {
        if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} player ${row.Name}`;
    }

    // ── Bulk operations ────────────────────────────────────────────────────────

    exportToExcel(): void {
        const data = this.players.map(({ id, view, Edit, Delete, homeClubId, ...rest }) => rest);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Players');
        XLSX.writeFile(wb, 'Players_report.xlsx');
    }

    async verifyUserEmails(): Promise<void> {
        const emails = this.selection.selected.map(item => item.Email);
        const res = await this._facadeService.verifyUserEmails(emails);
        if (res) {
            this.snackBar.open('Player emails have been verified.', 'x', { duration: 5000 });
            this.selection.clear();
        } else {
            this.snackBar.open('Error! Try Again later.', 'x', { duration: 5000 });
        }
    }

    sendResetPasswordEmail(): void {
        this._facadeService.executeSendResetEmailInBulk(this.selection.selected).subscribe(() => {
            this.snackBar.open('Password reset email sent successfully.', 'close', { duration: 3000 });
            this.selection.clear();
        });
    }

    downloadPDF(): void {
        const doc = new jsPDF();
        const col = ['Sr.', 'Name', 'Phone', 'Email', 'Mem/No', 'Category', 'Handicap'];
        const rows = this.players.map((p, i) => [
            i + 1, p.Name, p.Phone || '', p.Email || '',
            p.MembershipNo || '', p.Category || '', p.Handicap ?? '',
        ]);
        doc.setFontSize(18);
        doc.text('Players List', 15, 15);
        (doc as any).autoTable(col, rows, { startY: 25, theme: 'grid' });
        doc.save('Players.pdf');
    }

    // ── Excel import (unchanged logic) ─────────────────────────────────────────

    onFileChange(event: any): void {
        if (event.target.files.length > 0) this.file = event.target.files[0];
    }

    parseFlightsData(event: any): void {
        this.playersData = [];
        if (event.target.files.length > 0) this.file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer as ArrayBuffer);
            const arr = Array.from(data).map(c => String.fromCharCode(c));
            const bstr = arr.join('');
            const workbook = read(bstr, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            this.playersData = utils.sheet_to_json(worksheet, { raw: true, defval: '' });
            this.importExcelData();
        };
        fileReader.readAsArrayBuffer(this.file);
    }

    async importExcelData(): Promise<void> {
        try {
            this.importingList = true;
            this.savePlayers = [];
            this.duplicatePlayers = [];
            const clubMember: ClubMembership[] = [];

            for (const p of this.playersData) {
                const UniqueId = UniqueIdGenerator.generate();
                clubMember.push({ clubId: this.loggedInuser.adminClubId, playerId: UniqueId } as any);
                this.savePlayers.push({
                    id: UniqueId,
                    adminClubId: null, firebaseUid: null, fcmToken: null,
                    gemId: generateGemId.generate(UniqueId),
                    firstName: p.firstName, lastName: p.lastName,
                    gender: p.gender || null, dob: p.dob || null, picture: p.picture || null,
                    email: p.email || null, phone: p.phone || null,
                    playerCategory: p.category || null, handicap: p.hc || 0,
                    online: false, countryCode: p.code || null, extraData: p.extra || null,
                    membershipNumber: p.membershipNumber, userRole: 3, membership: null,
                });
            }

            const status = await this._facadeService.importPlayerList(this.savePlayers, clubMember);
            if (status) {
                const newProfiles = Math.max(0, this.savePlayers.length - this.duplicatePlayers.length);
                this.snackBar.open(
                    `${newProfiles} players created. ${this.duplicatePlayers.length} already existed.`,
                    'x', { duration: 5000 },
                );
                this.importingList = false;
                this.fileInputVariable.nativeElement.value = '';
                await this.delay(2000);
                this.loadPlayers();
            } else {
                this.snackBar.open('Error while loading file', 'x', { duration: 3000 });
                this.importingList = false;
            }
        } catch {
            this.importingList = false;
        }
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
