import {  NgModule } from '@angular/core';
import {  CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';
import {  MatTableModule } from '@angular/material';
import {  MatDatepickerModule } from '@angular/material/datepicker';
//import { FlexLayoutModule } from '@angular/flex-layout';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

import {  MatFormFieldModule, MatPaginatorModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatNativeDateModule,
          MatButtonModule, MatIconModule, MatSortModule, MatStepperModule, MatCardModule, MatSelectModule, MatToolbarModule,
          MatProgressBarModule, MatProgressSpinnerModule, MatExpansionModule, MatTabsModule, MatSnackBarModule  } from '@angular/material';

import { AmazingTimePickerModule } from 'amazing-time-picker';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';

@NgModule({
  declarations: [AttendanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatStepperModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTabsModule,
    MatSnackBarModule,
    DragDropModule,
    FormsModule,
    AmazingTimePickerModule,
  ]
})
export class AttendanceModule { }
