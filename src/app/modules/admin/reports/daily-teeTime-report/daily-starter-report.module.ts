import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
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
import { DailyStarterReportComponent } from './daily-starter-report.component';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { DialogUncompletedComponent } from '../../dialogs/dialog-uncomplete-players/dialog-uncomplete.component';
import { MatDialogModule } from '@angular/material/dialog';
const dailystarterStatsRoutes: Route[] = [
    {
        path: '',
        component: DailyStarterReportComponent,
    },
];

@NgModule({
    declarations: [DailyStarterReportComponent, ],
    imports: [
        RouterModule.forChild(dailystarterStatsRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatRippleModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSidenavModule,
        MatOptionModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        MatInputModule,
        MatDatepickerModule,
    ],
    providers: [DatePipe],
})
export class DailyTeeTimeReportModule { }
