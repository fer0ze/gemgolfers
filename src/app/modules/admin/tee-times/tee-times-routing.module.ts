import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeeTimesComponent } from './tee-times.component';
import { AddTeeTimesComponent } from './add-tee-times/add-tee-times.component';

const routes: Routes = [
  {
      path: '',
      component: TeeTimesComponent,
  },
  {
    path: 'add',
    component: AddTeeTimesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeeTimesRoutingModule { }
