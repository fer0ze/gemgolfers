import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DatePipe} from '@angular/common';
import { MergeProfilesComponent } from './merge-profiles.component';

const routes: Routes = [
  {
    path: '',
    component: MergeProfilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers : [DatePipe]
})
export class MergeProfilesRoutingModule { }
