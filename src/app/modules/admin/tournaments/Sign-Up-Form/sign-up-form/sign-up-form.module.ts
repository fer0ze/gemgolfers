import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SignUpFormComponent } from './sign-up-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SignUpFormRoutingModule } from './sign-up-form.routing.moduel';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [SignUpFormComponent],
    imports: [
        CommonModule,
        MatAutocompleteModule,
        SignUpFormRoutingModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatInputModule,
        MatTabsModule,
    ],
})
export class SignUpFormModule {}
