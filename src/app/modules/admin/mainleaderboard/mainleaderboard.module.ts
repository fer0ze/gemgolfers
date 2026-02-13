import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MainleaderboardRoutingModule } from './mainleaderboard-routing.module';
import { MainLeaderboardComponent } from './mainleaderboard.component';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { StrokePlayComponent } from './strokePlay/strokePlay.component';
import { StableFordComponent } from './stableFord/stableFord.component';
import { MatchPlayComponent } from './matchPlay/matchPlay.component';
import { ScrambleComponent } from './texasScramble/texasScramble.component';
import { NassauComponent } from './nassau/nassau.component';

@NgModule({
    declarations: [MainLeaderboardComponent, StrokePlayComponent,StableFordComponent,MatchPlayComponent,ScrambleComponent,NassauComponent],
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
