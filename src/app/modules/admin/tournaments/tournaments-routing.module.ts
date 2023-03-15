import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TournamentsComponent } from './tournaments.component';
import { AddTournamentComponent } from './add-tournament/add-tournament.component';
import { FlightManagementComponent } from './flight-management/flight-management.component';
import { CalculateHandicapComponent } from './calculate-handicap/calculate-handicap.component';
import { HandicapCalculationWhsComponent } from './handicap-calculation-whs/handicap-calculation-whs.component';
import { DatePipe } from '@angular/common';
import { PlayerManagementComponent } from './player-management/player-management.component';
import { ViewTournamentComponent } from './view-tournament/view-tournament.component';
import { SignUpFormComponent } from './Sign-Up-Form/sign-up-form/sign-up-form.component';

const routes: Routes = [
    {
        path: '',
        component: TournamentsComponent,
    },
    {
        path: 'add',
        component: AddTournamentComponent,
    },
    {
        path: 'manage/:id',
        component: ViewTournamentComponent,
    },
    {
        path: 'view/:id',
        component: ViewTournamentComponent,
    },
    {
        path: 'add/:id',
        component: AddTournamentComponent,
    },
    {
        path: 'handicap/:id',
        component: CalculateHandicapComponent,
    },
    {
        path: 'handicap-whs/:id',
        component: HandicapCalculationWhsComponent,
    },
    {
        path: 'players/:id',
        component: PlayerManagementComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DatePipe],
})
export class TournamentsRoutingModule {}
