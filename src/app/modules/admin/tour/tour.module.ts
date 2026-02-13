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
// import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
//import { FlexLayoutModule } from '@angular/flex-layout';
// import { TopPlayerModule } from 'app/shared/modules/top-player-section/top-player.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApolloModule } from 'apollo-angular';
import { TourComponent } from './tour.component';
import { playerRoutes } from '../players/players.routing';
import { tourRoutes } from './tour.routing.module';
import { DialogAddTourComponent } from '../dialogs/dialog-add-tour/dialog-add-tour.component';
import { DetailTourComponent } from './detail/detailTour.component';
import { TourGuideComponent } from './guides/guide.component';
import { QuillModule } from 'ngx-quill';
@NgModule({
    declarations: [TourComponent,DialogAddTourComponent,DetailTourComponent,TourGuideComponent],
    imports: [
        CommonModule,
        NgApexchartsModule,
        ReactiveFormsModule,
        MatTableModule,
        NgTemplateOutlet,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
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
        QuillModule.forRoot(),
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatSnackBarModule,
        ApolloModule,
        MatButtonModule,
        MatDialogModule,
        RouterModule.forChild(tourRoutes),
        FormsModule,
  
    ],
})
export class TourModule {}
