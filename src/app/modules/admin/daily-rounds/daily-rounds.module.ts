import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddDailyRoundComponent } from './add-daily-round/add-daily-round.component';
import { DialogAddExisitingPlayerComponent } from '../dialogs/dialog-add-exisiting-player/dialog-add-exisiting-player.component';
// import { AddPlayerDailyScoreComponent } from './add-player-daily-score/add-player-daily-score.component';
import { ViewDailyRoundComponent } from './view-daily-round/view-daily-round.component';
import { DailyRoundsComponent } from './daily-rounds.component';
import { DailyRoundsRoutingModule } from './daily-rounds-routing.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { DialogChangeCourseHoleSetComponent } from '../dialogs/dialog-change-course-hole-set/dialog-change-course-hole-set.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
// import { AmazingTimePickerModule } from 'amazing-time-picker';
@NgModule({
    declarations: [
        DailyRoundsComponent,
        AddDailyRoundComponent,
        // AddPlayerDailyScoreComponent,
        ViewDailyRoundComponent,
        DialogAddExisitingPlayerComponent,
        DialogChangeCourseHoleSetComponent,
    ],
    imports: [
        CommonModule,
        DailyRoundsRoutingModule,
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSortModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        MatTabsModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatSidenavModule,
        MatDialogModule,
        NgxMaterialTimepickerModule,
        MatSlideToggleModule,
        MatTooltipModule,
        // AmazingTimePickerModule,
    ],

})
export class DailyRoundsModule { }
