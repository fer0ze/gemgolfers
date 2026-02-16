import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddDailyRoundComponent } from './add-daily-round/add-daily-round.component';
import { DialogAddExisitingPlayerComponent } from '../dialogs/dialog-add-exisiting-player/dialog-add-exisiting-player.component';
// import { AddPlayerDailyScoreComponent } from './add-player-daily-score/add-player-daily-score.component';
import { ViewDailyRoundComponent } from './view-daily-round/view-daily-round.component';
import { DailyRoundsComponent } from './daily-rounds.component';
import { DailyRoundsRoutingModule } from './daily-rounds-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { DialogChangeCourseHoleSetComponent } from '../dialogs/dialog-change-course-hole-set/dialog-change-course-hole-set.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
