import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTableModule } from '@angular/material/table';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



//import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './leaderboard.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Leader } from 'app/shared/classes/leader';
import { StrokePlayComponent } from '../mainleaderboard/strokePlay/strokePlay.component';
import { StableFordComponent } from '../mainleaderboard/stableFord/stableFord.component';
import { MatchPlayComponent } from '../mainleaderboard/matchPlay/matchPlay.component';
import { ScrambleComponent } from '../mainleaderboard/texasScramble/texasScramble.component';

@NgModule({
  declarations: [LeaderboardComponent, StrokePlayComponent,StableFordComponent,MatchPlayComponent,ScrambleComponent],
  imports: [
    CommonModule,
   // LeaderboardRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDialogModule,
  ],
})
export class LeaderboardModule { }
