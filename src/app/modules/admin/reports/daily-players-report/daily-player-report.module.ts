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
import { CommonModule } from '@angular/common';
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
import { UserDetailsDilogueComponent } from '../../dialogs/dialog-user-details/user-details-dilogue.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DailyPlayerReportComponent } from './daily-player-report.component';
import { DailyPlayerReportResolver } from './daily-player.resolver';

const dailyPlayerRoutes: Route[] = [
    {
        path: '',
        component: DailyPlayerReportComponent,
        resolve: {
            data: DailyPlayerReportResolver
        }
    },
];

@NgModule({
    declarations: [DailyPlayerReportComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(dailyPlayerRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatDialogModule,
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
    entryComponents: [UserDetailsDilogueComponent],
    providers: [DailyPlayerReportResolver, DatePipe],
})
export class DailyPlayerReportModule { }
