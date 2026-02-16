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
import { UpdatedHandicapReportComponent } from './updated-handicap-report.component';
import { MatPaginatorModule } from '@angular/material/paginator';

const dailystarterStatsRoutes: Route[] = [
    {
        path: '',
        component: UpdatedHandicapReportComponent,
    },
];

@NgModule({
    declarations: [UpdatedHandicapReportComponent],
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
        MatSidenavModule,
        MatOptionModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        MatPaginatorModule,
        MatSortModule,
        TranslocoModule,
        SharedModule,
        MatInputModule,
        MatDatepickerModule,
    ],
    providers: [DatePipe],
})
export class UpdatedHandicapReportModule {}
