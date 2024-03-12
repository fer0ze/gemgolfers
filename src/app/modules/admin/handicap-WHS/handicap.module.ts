import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { HandicapsComponent } from './WHS/handicaps.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    // entryComponents: [UserWHSDeatilsDialogueComponent],
})
export class HandicapModule {}
