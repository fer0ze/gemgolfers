import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PlayerComponent } from './player.component';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
const exampleRoutes: Route[] = [
    {
        path: '',
        component: PlayerComponent,
    },
];

@NgModule({
    declarations: [PlayerComponent],
    imports: [
        RouterModule.forChild(exampleRoutes),
        MatSortModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        CommonModule,
        TranslocoModule,
        MatButtonModule,
        NgApexchartsModule,
    ],
})
export class PlayerModule {}
