import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { StatModule } from "../../../shared/modules/stat/stat.module";
// import { UserDetailsDilogueComponent } from "../material-components/user-details-dilogue/user-details-dilogue.component";
// import { UserWHSDeatilsDialogueComponent } from "../material-components/user-whs-deatils-dialogue/user-whs-deatils-dialogue.component";
// import { WhiteSectionModule } from '../../../shared/modules/white-section/white-section.module';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackComponent } from "./feedback.component";
import { FeedbackRoutingModule } from "./feedback-routing.module";
import { DialogShowfeedbackComponent } from "../dialogs/dialog-showfeedback/dialog-showfeedback.component";
@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,FeedbackRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatCardModule,

    MatRadioModule,
    MatSelectModule,

    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,

    MatTabsModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  declarations: [FeedbackComponent, DialogShowfeedbackComponent],
  entryComponents: [DialogShowfeedbackComponent],
})
export class FeedbackModule {}
