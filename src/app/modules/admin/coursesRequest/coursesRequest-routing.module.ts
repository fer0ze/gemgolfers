import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CoursesRequestComponent, } from "./coursesRequest.component";

const routes: Routes = [
  {
    path: "",
    component: CoursesRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRoutingModule {}
