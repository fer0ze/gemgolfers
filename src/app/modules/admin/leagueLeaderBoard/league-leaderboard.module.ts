import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
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
