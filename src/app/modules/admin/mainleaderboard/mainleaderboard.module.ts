import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MainleaderboardRoutingModule } from './mainleaderboard-routing.module';
import { MainLeaderboardComponent } from './mainleaderboard.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { StrokePlayComponent } from './strokePlay/strokePlay.component';

@NgModule({
    declarations: [MainLeaderboardComponent, StrokePlayComponent],
    imports: [
        CommonModule,
        MainleaderboardRoutingModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatProgressBarModule,
        MatInputModule,
        MatTabsModule,
    ],
})
export class MainLeaderboardModule { }
