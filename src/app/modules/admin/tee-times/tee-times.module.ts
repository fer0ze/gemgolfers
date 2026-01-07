import {  NgModule } from '@angular/core';
import {  CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
//import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDatepickerModule } from '@angular/material/datepicker';

// import { AmazingTimePickerModule } from 'amazing-time-picker';
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
import { TeeTimesRoutingModule } from './tee-times-routing.module';
import { TeeTimesComponent } from './tee-times.component';
import { AddTeeTimesComponent } from './add-tee-times/add-tee-times.component';
import { DialogTeeTimeSlotComponent } from '../dialogs/dialog-tee-time-slot/dialog-tee-time-slot.component';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DialogPlayerListComponent } from '../dialogs/dialog-player-list-flight/dialog-player-list.component';
import { ViewTeeTimeComponent } from './view-tee-times/view-tee-timescomponent';
import { DialogAddGuestComponent } from '../dialogs/dialog-add-guest/dialog-add-guest.component';



@NgModule({
  declarations: [TeeTimesComponent, AddTeeTimesComponent,DialogAddGuestComponent, DialogTeeTimeSlotComponent,DialogPlayerListComponent,ViewTeeTimeComponent],
  imports: [
    CommonModule,
    TeeTimesRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatSortModule,
    MatStepperModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTabsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDialogModule,
    MatExpansionModule,
    // AmazingTimePickerModule,
  ],
  entryComponents: [
    DialogTeeTimeSlotComponent
  ]
})
export class TeeTimesModule { }
