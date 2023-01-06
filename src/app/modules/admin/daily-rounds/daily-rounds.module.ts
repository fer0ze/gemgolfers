import {  NgModule } from '@angular/core';
import {  CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';
import {  MatTableModule } from '@angular/material/table';
import {  MatDatepickerModule } from '@angular/material/datepicker';
// import { DailogDailyPlayerScoreComponent } from '../material-components/dialog-daily-player-score/dailog-daily-player-score.component';
// import { DialogChangeCourseHoleSetComponent } from '../material-components/dialog-change-course-hole-set/dialog-change-course-hole-set.component';
import { AddDailyRoundComponent } from './add-daily-round/add-daily-round.component';
 import { DialogAddExisitingPlayerComponent } from '../dialogs/dialog-add-exisiting-player/dialog-add-exisiting-player.component';
import { AddPlayerDailyScoreComponent } from './add-player-daily-score/add-player-daily-score.component';
// import { DialogAddDailyRoundPlayerComponent } from 'src/app/layout/material-components/dialog-add-daily-round-player/dialog-add-daily-round-player.component';
import { ViewDailyRoundComponent } from './view-daily-round/view-daily-round.component';
import { DailyRoundsComponent } from './daily-rounds.component';
import { DailyRoundsRoutingModule } from './daily-rounds-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTimepickerModule } from 'mat-timepicker';
import { AmazingTimePickerModule } from 'amazing-time-picker';
@NgModule({
  declarations: [DailyRoundsComponent, AddDailyRoundComponent, AddPlayerDailyScoreComponent, ViewDailyRoundComponent,DialogAddExisitingPlayerComponent],
  imports: [
    CommonModule,
    DailyRoundsRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatExpansionModule,
    MatTabsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDialogModule,MatTimepickerModule,
    AmazingTimePickerModule,
    MatTooltipModule,
    // FlexLayoutModule.withConfig({addFlexToParent: false})
  ],
  entryComponents: [
    // DailogDailyPlayerScoreComponent,
    // DialogChangeCourseHoleSetComponent,
     DialogAddExisitingPlayerComponent,
    // DialogAddDailyRoundPlayerComponent

  ]
})
export class DailyRoundsModule { }
