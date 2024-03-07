import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeeTimesComponent } from './tee-times.component';
import { AddTeeTimesComponent } from './add-tee-times/add-tee-times.component';
import { ViewTeeTimeComponent } from './view-tee-times/view-tee-timescomponent';
import { DatePipe } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: TeeTimesComponent,
  },
  {
    path: 'add',
    component: AddTeeTimesComponent
  },
  {
    path: "view-teetimes/:id",
    component: ViewTeeTimeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class TeeTimesRoutingModule { }
