import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchplayComponent } from './matchplay.component';
const routes: Routes = [
  {
    path: '',
    component: MatchplayComponent
  },
  {
      path: ':id',
      component: MatchplayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchplayRoutingModule { }
