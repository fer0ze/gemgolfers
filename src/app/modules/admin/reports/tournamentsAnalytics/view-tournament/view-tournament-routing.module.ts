import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DatePipe} from '@angular/common';


import { ViewTournamentComponent } from './view-tournament.component';

const routes: Routes = [
  {
    path: '',
    component: ViewTournamentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers : [DatePipe]
})
export class ViewTournamentRoutingModule { }
