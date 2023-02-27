import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MainleaderboardRoutingModule } from './mainleaderboard-routing.module';
import { MainLeaderboardComponent } from './mainleaderboard.component';

@NgModule({
    declarations: [MainLeaderboardComponent],
    imports: [
        CommonModule,
        MainleaderboardRoutingModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatDialogModule,
    ],
})
export class MainLeaderboardModule {}
