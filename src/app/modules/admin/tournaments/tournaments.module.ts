import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentsComponent } from './tournaments.component';
import { AddTournamentComponent } from './add-tournament/add-tournament.component';
import { FlightManagementComponent } from './flight-management/flight-management.component';
import { CalculateHandicapComponent } from './calculate-handicap/calculate-handicap.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { HandicapCalculationWhsComponent } from './handicap-calculation-whs/handicap-calculation-whs.component';
import { PlayerManagementComponent } from './player-management/player-management.component';
import { DialogHanidcapListComponent } from '../dialogs/dialog-hanidcap-list/dialog-hanidcap-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogMoveFlightComponent } from '../dialogs/dialog-move-flight/dialog-move-flight.component';
import { DialogOverviewComponent } from '../dialogs/dialog-overview/dialog-overview.component';
import { DialogPlayerComponent } from '../dialogs/dialog-player/dialog-player.component';
import { DialogPlayerListComponent } from '../dialogs/dialog-player-list/dialog-player-list.component';
import { ViewTournamentComponent } from './view-tournament/view-tournament.component';
import { DialogMarshalComponent } from '../dialogs/dialog-marshal/dialog-marshal.component';
import { DialogPlayingCategoryComponent } from '../dialogs/dialog-playing-category/dialog-playing-category.component';
import { DialogCourseDetailsComponent } from '../dialogs/dialog-course-details/dialog-course-details.component';
import { DialogCloseRoundComponent } from '../dialogs/dialog-close-round/dialog-close-round.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WhiteSectionModule } from 'app/shared/modules/white-section/white-section.module';
import { TopPlayerModule } from 'app/shared/modules/top-player-section/top-player.module';
import { BlockWhiteSectionComponent } from 'app/shared/modules/block-white-section/block-white-section.component';
import { BlockWhiteSectionModule } from 'app/shared/modules/block-white-section/block-white-section.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatchplayComponent } from '../matchplay/matchplay.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { GraphQLModule } from 'app/graphql.module';
import { ApolloModule } from 'apollo-angular';
import { DialogAddPlayerComponent } from '../dialogs/dialog-add-player/dialog-add-player.component';
import { DialogPlayingDatesComponent } from '../dialogs/dialog-playing-dates/dialog-playing-dates.component';
import { DialogPlayerScoreComponent } from '../dialogs/dialog-player-score/dialog-player-score.component';
import { DialogAddMemberComponent } from '../dialogs/dialog-add-member/dialog-add-member.component';
import { SignUpFormComponent } from './Sign-Up-Form/sign-up-form/sign-up-form.component';
@NgModule({
    declarations: [
        TournamentsComponent,
        AddTournamentComponent,
        FlightManagementComponent,
        CalculateHandicapComponent,
        DialogHanidcapListComponent,
        HandicapCalculationWhsComponent,
        PlayerManagementComponent,
        LeaderboardComponent,
        DialogMoveFlightComponent,
        DialogAddPlayerComponent,
        DialogOverviewComponent,
        DialogPlayerComponent,DialogPlayerScoreComponent,
        DialogPlayerListComponent,
        MatchplayComponent,
        ViewTournamentComponent,
        DialogMarshalComponent,
        DialogPlayingCategoryComponent,
        DialogAddMemberComponent,
        DialogCourseDetailsComponent,
        DialogCloseRoundComponent,
        DialogPlayingDatesComponent
    ],
    imports: [
        CommonModule,
        NgApexchartsModule,
        TournamentsRoutingModule,
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatPaginatorModule,
        MatInputModule,
        WhiteSectionModule,
        TopPlayerModule,
        MatButtonModule,
        GraphQLModule,
        BlockWhiteSectionModule,
        MatIconModule,
        MatSortModule,
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
        ApolloModule,
        MatDialogModule,
        FormsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        AmazingTimePickerModule,
        FlexLayoutModule,
    ],
    entryComponents: [DialogHanidcapListComponent],
    providers:[FlightManagementComponent]
   
})
export class TournamentsModule {}
