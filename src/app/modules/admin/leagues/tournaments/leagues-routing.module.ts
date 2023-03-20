import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaguesComponent, TournamentsComponent } from './leagues.component';
import { DatePipe } from '@angular/common';


const routes: Routes = [
    {
        path: '',
        component: LeaguesComponent,
    },
    // {
    //     path: 'add',
    //     component: AddTournamentComponent,
    // },
    // {
    //     path: 'manage/:id',
    //     component: ViewTournamentComponent,
    // },
    // {
    //     path: 'view/:id',
    //     component: ViewTournamentComponent,
    // },
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
