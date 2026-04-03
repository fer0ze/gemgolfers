import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { clubsRoutes } from './clubs.routing';
import { ClubsListComponent } from './clubs-list/clubs-list.component';
import { ClubDetailsComponent } from './club-details/club-details.component';
import { ClubViewComponent } from './club-view/club-view.component';

@NgModule({
    declarations: [
        ClubsListComponent,
        ClubDetailsComponent,
        ClubViewComponent,
    ],
    imports: [
        RouterModule.forChild(clubsRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule,
        MatChipsModule,
        MatAutocompleteModule,
    ],
})
export class ClubsModule {}
