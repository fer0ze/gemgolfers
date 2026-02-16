import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SignUpFormComponent } from '../../tournaments/Sign-Up-Form/sign-up-form/sign-up-form.component';
import { LeagueReportComponent } from './league-report.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Resolver } from './league-resolver.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogLeaguesComponent } from '../../dialogs/dialog-leagues/dialog-leagues.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
const ClubReportRoutes: Route[] = [
    {
        path: '',
        component: LeagueReportComponent,
        resolve: {
            data: Resolver,
        }
    },
];

@NgModule({
    declarations: [LeagueReportComponent,DialogLeaguesComponent],
    imports: [
        RouterModule.forChild(ClubReportRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,MatCheckboxModule,
        NgApexchartsModule,
        MatMenuModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatRippleModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSnackBarModule,
        MatPaginatorModule,MatDialogModule,
        MatSidenavModule,
        MatOptionModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        MatTooltipModule,
        TranslocoModule,
        SharedModule,
        MatInputModule,
        MatDatepickerModule,
    ],
    providers: [DatePipe],
})
export class LeagueReportModule { }
