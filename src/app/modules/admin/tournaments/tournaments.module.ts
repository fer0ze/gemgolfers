import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentsComponent } from './tournaments.component';
import { AddTournamentComponent } from './add-tournament/add-tournament.component';
import { FlightManagementComponent } from './flight-management/flight-management.component';
// import { CalculateHandicapComponent } from './calculate-handicap/calculate-handicap.component';
// import { AmazingTimePickerModule } from 'amazing-time-picker';

import { DialogHanidcapListComponent } from '../dialogs/dialog-hanidcap-list/dialog-hanidcap-list.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { DialogMoveFlightComponent } from '../dialogs/dialog-move-flight/dialog-move-flight.component';
import { DialogOverviewComponent } from '../dialogs/dialog-overview/dialog-overview.component';
import { DialogPlayerComponent } from '../dialogs/dialog-player/dialog-player.component';
import { DialogPlayerListComponent } from '../dialogs/dialog-player-list/dialog-player-list.component';
import { ViewTournamentComponent } from './view-tournament/view-tournament.component';
import { DialogMarshalComponent } from '../dialogs/dialog-marshal/dialog-marshal.component';
import { DialogPlayingCategoryComponent } from '../dialogs/dialog-playing-category/dialog-playing-category.component';
import { DialogCourseDetailsComponent } from '../dialogs/dialog-course-details/dialog-course-details.component';
import { DialogCloseRoundComponent } from '../dialogs/dialog-close-round/dialog-close-round.component';
//import { FlexLayoutModule } from '@angular/flex-layout';
// import { TopPlayerModule } from 'app/shared/modules/top-player-section/top-player.module';
import { BlockWhiteSectionComponent } from 'app/shared/modules/block-white-section/block-white-section.component';
import { BlockWhiteSectionModule } from 'app/shared/modules/block-white-section/block-white-section.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatchplayComponent } from '../matchplay/matchplay.component';
import { DialogAddPlayerComponent } from '../dialogs/dialog-add-player/dialog-add-player.component';
import { DialogPlayingDatesComponent } from '../dialogs/dialog-playing-dates/dialog-playing-dates.component';
import { DialogPlayerScoreComponent } from '../dialogs/dialog-player-score/dialog-player-score.component';
import { DialogAddMemberComponent } from '../dialogs/dialog-add-member/dialog-add-member.component';
import { SignUpFormComponent } from './Sign-Up-Form/sign-up-form/sign-up-form.component';
import { TeamManagementComponent } from './team-management/team-management.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { PairManagementComponent } from './pair-management/pair-management.component';
import { InvalidCategoryPlayersComponent } from '../dialogs/dialog-invalid-category-players/invalid-category-players.component';
import { DialogEditPlayerHandicapComponent } from '../dialogs/dialog-edit-player-handicap/dialog-edit-player-handicap.component';
import { NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
@NgModule({
    declarations: [
        TournamentsComponent,
        AddTournamentComponent,
        PairManagementComponent,
        FlightManagementComponent,
        DialogHanidcapListComponent,
        DialogMoveFlightComponent,
        DialogAddPlayerComponent,
        DialogOverviewComponent,
        DialogPlayerComponent,
        InvalidCategoryPlayersComponent,
        DialogPlayerScoreComponent,
        DialogPlayerListComponent,
        MatchplayComponent,
        ViewTournamentComponent,
        DialogMarshalComponent,
        DialogPlayingCategoryComponent,
        DialogAddMemberComponent,TeamManagementComponent,
        DialogCourseDetailsComponent,
        DialogCloseRoundComponent,
        DialogPlayingDatesComponent,
        DialogEditPlayerHandicapComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        NgApexchartsModule,
        TournamentsRoutingModule,
        ReactiveFormsModule,
        MatTableModule,
        NgTemplateOutlet,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatInputModule,
        NgxMaterialTimepickerModule,
        MatButtonModule,
        BlockWhiteSectionModule,
        MatIconModule,
        MatSortModule,
        MatSlideToggleModule,
        MatStepperModule,
        MatMenuModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatTabsModule,
        MatSnackBarModule,
        MatToolbarModule,
        DragDropModule,
        MatDialogModule,
        FormsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        // AmazingTimePickerModule,

    ],
    entryComponents: [DialogHanidcapListComponent],
    providers: [FlightManagementComponent],
})
export class TournamentsModule {}
