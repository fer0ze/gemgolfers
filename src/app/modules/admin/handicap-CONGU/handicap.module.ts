import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ReactiveFormsModule } from '@angular/forms';
//import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { StatModule } from "../../../shared/modules/stat/stat.module";

import { HandicapRoutingModule } from './handicap-routing.module';
import { HandicapComponent } from './handicap.component';
// import { UserDetailsDilogueComponent } from "../material-components/user-details-dilogue/user-details-dilogue.component";
// import { UserWHSDeatilsDialogueComponent } from "../material-components/user-whs-deatils-dialogue/user-whs-deatils-dialogue.component";
// import { WhiteSectionModule } from '../../../shared/modules/white-section/white-section.module';
import { PlayerHandicapComponent } from './player-handicap/player-handicaps.component';
import { DatePipe } from '@angular/common';
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
import { HandicapsComponent } from './CONGU/handicaps.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
@NgModule({
    declarations: [
        HandicapComponent,
        // UserWHSDeatilsDialogueComponent,
        HandicapsComponent,
        PlayerHandicapComponent,
    ],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(HandicapRoutingModule),
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        MatCardModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSidenavModule,
        MatMenuModule,
        // StatModule,
        MatDialogModule,
        MatTooltipModule,
        // WhiteSectionModule,
        MatProgressBarModule,
        MatRippleModule,
        CommonModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        // FlexLayoutModule.withConfig({ addFlexToParent: false }),
    ],
})
export class HandicapModule {}
