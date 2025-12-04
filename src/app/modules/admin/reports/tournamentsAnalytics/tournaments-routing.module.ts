import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentsComponent } from './tournaments.component';
import { DatePipe } from '@angular/common';
import { ViewTournamentComponent } from './view-tournament/view-tournament.component';

const routes: Routes = [
    {
        path: '',
        component: TournamentsComponent,
    },
    {
        path: 'view/:id',
        component: ViewTournamentComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DatePipe],
})
export class TournamentsRoutingModule {}
