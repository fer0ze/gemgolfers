import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaguesComponent } from './leagues.component';
import { DatePipe } from '@angular/common';
import { DetailLeagueComponent } from './detail/detail-league.component';




const routes: Routes = [
    {
        path: '',
        component: LeaguesComponent,
    },
    {
        path: ':id',
        component: DetailLeagueComponent,
    },
    // {
    //     path: 'add/:id',
    //     component: AddTournamentComponent,
    // },
    // {
    //     path: 'handicap/:id',
    //     component: CalculateHandicapComponent,
    // },
    // {
    //     path: 'handicap-whs/:id',
    //     component: HandicapCalculationWhsComponent,
    // },
    // {
    //     path: 'players/:id',
    //     component: PlayerManagementComponent,
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DatePipe],
})
export class LeaguesRoutingModule {}
