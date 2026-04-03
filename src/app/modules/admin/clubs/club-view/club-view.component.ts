import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormControl } from '@angular/forms';
import { FacadeService } from 'app/shared/services/facade.service';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    standalone: false,
    selector: 'app-club-view',
    templateUrl: './club-view.component.html',
})
export class ClubViewComponent implements OnInit, OnDestroy {

    clubId: string;
    club: any = null;
    isLoading: boolean = true;

    // Stats
    totalMembers: number = 0;
    totalTournaments: number = 0;
    totalSingleRounds: number = 0;
    totalCourses: number = 0;
    totalRounds: number = 0;
    completedTournaments: number = 0;

    // Category breakdown
    categoryStats: { label: string; count: number; color: string }[] = [];

    // Active expandable panel: 'tournaments' | 'dailyRounds' | null
    activePanelTab: 'tournaments' | 'dailyRounds' | null = null;

    // ── Tournaments panel ─────────────────────────────────────────────────────
    tournamentList: any[] = [];
    tournamentsTotal: number = 0;
    tourPageSize: number = 10;
    tourPageIndex: number = 0;
    tourIsLoading: boolean = false;
    tourDisplayedColumns: string[] = ['index', 'title', 'course', 'format', 'rounds', 'date', 'status', 'action'];

    // ── Daily Rounds panel ────────────────────────────────────────────────────
    dailyRoundsList: any[] = [];
    dailyRoundsTotal: number = 0;
    drPageSize: number = 10;
    drPageIndex: number = 0;
    drIsLoading: boolean = false;
    drDisplayedColumns: string[] = ['index', 'title', 'course', 'format', 'date', 'status', 'action'];

    // ── Members table — server-side pagination ────────────────────────────────
    members: any[] = [];
    membersTotal: number = 0;
    pageSize: number = 15;
    pageIndex: number = 0;
    isMembersLoading: boolean = false;
    displayedColumns: string[] = ['index', 'name', 'category', 'handicap', 'membershipNumber', 'email', 'phone'];
    searchControl: UntypedFormControl = new UntypedFormControl('');

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private facadeService: FacadeService,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.clubId = this.route.snapshot.paramMap.get('id');
        if (!this.clubId) {
            this.router.navigate(['/clubs']);
            return;
        }

        this.loadInitialData();

        this.searchControl.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(400),
            distinctUntilChanged(),
        ).subscribe(() => {
            this.pageIndex = 0;
            this.loadMembers();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async loadInitialData(): Promise<void> {
        this.isLoading = true;
        try {
            const [clubsResult, statsResult, categoryResult, membersResult] = await Promise.all([
                this.facadeService.getClubList(),
                this.facadeService.getClubStatsByClubId(this.clubId),
                this.facadeService.getClubMemberAggregateByCategroy(this.clubId),
                this.facadeService.getClubMembersPaginated(this.clubId, this.pageSize, 0, ''),
            ]);

            // Club details
            const clubs: any[] = clubsResult?.club || [];
            this.club = clubs.find(c => c.id === this.clubId);
            if (!this.club) {
                this.snackBar.open('Club not found.', 'x', { duration: 3000 });
                this.router.navigate(['/clubs']);
                return;
            }
            this.totalCourses = this.club.courses?.length || 0;

            // Tournament stats — singleRound:false aggregate
            const aggData = statsResult?.tournament_aggregate;
            const singleRoundsAgg = statsResult?.single_rounds;
            this.totalTournaments = aggData?.aggregate?.count || 0;
            this.totalSingleRounds = singleRoundsAgg?.aggregate?.count || 0;
            const tournamentRoundsSum = aggData?.aggregate?.sum?.noOfRounds || 0;
            this.totalRounds = tournamentRoundsSum + this.totalSingleRounds;
            const nodes: any[] = aggData?.nodes || [];
            this.completedTournaments = nodes.filter(t => (t.activeRound || 0) > (t.noOfRounds || 1)).length;

            // Category breakdown
            const catData = categoryResult?.club?.[0];
            if (catData) {
                this.categoryStats = [
                    { label: 'Amateurs',             count: catData.Amateurs?.aggregate?.count || 0,             color: '#3B82F6' },
                    { label: 'Senior Amateurs',      count: catData.Senior_Amateurs?.aggregate?.count || 0,      color: '#8B5CF6' },
                    { label: 'Veterans',             count: catData.Veterans?.aggregate?.count || 0,             color: '#F59E0B' },
                    { label: 'Junior Amateurs',      count: catData.Junior_Amateurs?.aggregate?.count || 0,      color: '#10B981' },
                    { label: 'Ladies',               count: catData.Ladies?.aggregate?.count || 0,               color: '#EC4899' },
                    { label: 'Professionals',        count: catData.Professionals?.aggregate?.count || 0,        color: '#EF4444' },
                    { label: 'Senior Professionals', count: catData.Senior_Professionals?.aggregate?.count || 0, color: '#6366F1' },
                ].filter(c => c.count > 0);
            }

            // Members — first page only
            this.membersTotal = membersResult?.player_aggregate?.aggregate?.count || 0;
            this.totalMembers = this.membersTotal;
            this.members = this.mapPlayers(membersResult?.player || []);

        } catch (err) {
            console.error(err);
            this.snackBar.open('Failed to load club data.', 'x', { duration: 3000 });
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    // ── Panel toggle ──────────────────────────────────────────────────────────

    togglePanel(tab: 'tournaments' | 'dailyRounds'): void {
        if (this.activePanelTab === tab) {
            this.activePanelTab = null;
            return;
        }
        this.activePanelTab = tab;
        if (tab === 'tournaments' && this.tournamentList.length === 0) {
            this.loadTournaments();
        }
        if (tab === 'dailyRounds' && this.dailyRoundsList.length === 0) {
            this.loadDailyRounds();
        }
    }

    // ── Tournaments ───────────────────────────────────────────────────────────

    async loadTournaments(): Promise<void> {
        this.tourIsLoading = true;
        try {
            const result = await this.facadeService.getClubTournamentsPaginated(
                this.clubId, this.tourPageSize, this.tourPageIndex * this.tourPageSize,
            );
            this.tournamentsTotal = result?.tournament_aggregate?.aggregate?.count || 0;
            this.tournamentList = result?.tournament || [];
        } catch (err) {
            console.error(err);
        } finally {
            this.tourIsLoading = false;
            this.cdr.detectChanges();
        }
    }

    onTourPageChange(event: PageEvent): void {
        this.tourPageIndex = event.pageIndex;
        this.tourPageSize = event.pageSize;
        this.loadTournaments();
    }

    getTournamentStatus(t: any): { label: string; classes: string } {
        if ((t.activeRound || 0) > (t.noOfRounds || 1)) {
            return { label: 'Completed', classes: 'bg-green-50 text-green-700' };
        }
        if (t.started) {
            return { label: 'Live', classes: 'bg-red-50 text-red-600' };
        }
        return { label: 'Upcoming', classes: 'bg-blue-50 text-blue-600' };
    }

    viewTournament(id: string): void {
        this.router.navigate(['/tournaments/view', id]);
    }

    // ── Daily Rounds ──────────────────────────────────────────────────────────

    async loadDailyRounds(): Promise<void> {
        this.drIsLoading = true;
        try {
            const result = await this.facadeService.getClubDailyRoundsPaginated(
                this.clubId, this.drPageSize, this.drPageIndex * this.drPageSize,
            );
            this.dailyRoundsTotal = result?.tournament_aggregate?.aggregate?.count || 0;
            this.dailyRoundsList = result?.tournament || [];
        } catch (err) {
            console.error(err);
        } finally {
            this.drIsLoading = false;
            this.cdr.detectChanges();
        }
    }

    onDrPageChange(event: PageEvent): void {
        this.drPageIndex = event.pageIndex;
        this.drPageSize = event.pageSize;
        this.loadDailyRounds();
    }

    getDailyRoundStatus(t: any): { label: string; classes: string } {
        if (t.started && (t.activeRound || 0) > (t.noOfRounds || 1)) {
            return { label: 'Completed', classes: 'bg-green-50 text-green-700' };
        }
        if (t.started) {
            return { label: 'Live', classes: 'bg-red-50 text-red-600' };
        }
        return { label: 'Upcoming', classes: 'bg-blue-50 text-blue-600' };
    }

    // ── Members ───────────────────────────────────────────────────────────────

    async loadMembers(): Promise<void> {
        this.isMembersLoading = true;
        try {
            const search = this.searchControl.value || '';
            const result = await this.facadeService.getClubMembersPaginated(
                this.clubId, this.pageSize, this.pageIndex * this.pageSize, search,
            );
            this.membersTotal = result?.player_aggregate?.aggregate?.count || 0;
            this.members = this.mapPlayers(result?.player || []);
        } catch (err) {
            console.error(err);
        } finally {
            this.isMembersLoading = false;
            this.cdr.detectChanges();
        }
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadMembers();
    }

    private mapPlayers(players: any[]): any[] {
        return players.map(p => ({
            id: p.id,
            name: ((p.firstName || '') + ' ' + (p.lastName || '')).trim(),
            category: p.playerCategory || '—',
            handicap: p.handicap ?? p.handicapWhsIndex ?? '—',
            membershipNumber: p.membershipNumber || '—',
            email: p.email || '—',
            phone: p.phone || '—',
        }));
    }

    editClub(): void {
        this.router.navigate(['/clubs/edit', this.clubId]);
    }

    goBack(): void {
        this.router.navigate(['/clubs']);
    }
}
