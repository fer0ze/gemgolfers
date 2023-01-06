import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';

// import { PlayersRoutingModule } from './players-routing.module';

import { WhiteSectionModule } from 'app/shared/modules/white-section/white-section.module';
import { CourseRoutingModule } from './course-routing.module';
// import { AddCourseComponent } from './add-course/add-course.component';
// import { ViewCourseComponent } from './view-course/view-course.component';
import { CourseComponent } from './course.component';
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
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
  declarations: [CourseComponent],
  imports: [
    CommonModule,CourseRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,

    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
	  MatTabsModule,
    WhiteSectionModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
  
  ]
})
export class CourseModule { }
