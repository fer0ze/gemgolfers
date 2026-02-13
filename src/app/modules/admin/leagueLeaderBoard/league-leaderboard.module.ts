import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { LeagueLeaderboardComponent } from './league-leaderboard.component';
import { Route, RouterModule } from '@angular/router';

const Routes: Route[] = [
    {
        path: '',
        component: LeagueLeaderboardComponent,
    },
    {
        path: ':id',
        component: LeagueLeaderboardComponent,
    },
];
@NgModule({
    declarations: [LeagueLeaderboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(Routes),
        MatSelectModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatProgressBarModule,
        MatInputModule,
        MatTabsModule,
    ],
})
export class LeagueLeaderboardModule {}
