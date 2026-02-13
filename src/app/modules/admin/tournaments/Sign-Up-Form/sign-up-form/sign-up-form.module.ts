import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SignUpFormComponent } from './sign-up-form.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { SignUpFormRoutingModule } from './sign-up-form.routing.moduel';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
    declarations: [SignUpFormComponent],
    imports: [
        CommonModule,
        MatAutocompleteModule,
        SignUpFormRoutingModule,
        MatFormFieldModule,
        MatSelectModule,
        FuseAlertModule,
        MatButtonToggleModule,
        MatSnackBarModule,
        MatDialogModule,
        MatButtonModule,MatIconModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatInputModule,
        MatTabsModule,
    ],
})
export class SignUpFormModule {}
