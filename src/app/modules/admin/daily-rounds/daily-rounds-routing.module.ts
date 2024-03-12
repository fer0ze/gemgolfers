import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddDailyRoundComponent } from "./add-daily-round/add-daily-round.component";
import { DailyRoundsComponent } from "./daily-rounds.component";
// import { AddPlayerDailyScoreComponent } from "./add-player-daily-score/add-player-daily-score.component";
import { DatePipe } from "@angular/common";
import { ViewDailyRoundComponent } from "./view-daily-round/view-daily-round.component";

const routes: Routes = [
  {
    path: "",
    component: DailyRoundsComponent,
  },
  {
    path: "filter/:id",
    component: DailyRoundsComponent,
  },
  {
    path: "add-daily-rounds",
    component: AddDailyRoundComponent,
  },
  {
    path: "view-daily-rounds/:id",
    component: ViewDailyRoundComponent,
  },
  // {
  //   path: "add-player-daily-score/filter/:id",
  //   component: AddPlayerDailyScoreComponent,
  //   canDeactivate: [DirtyCheckGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class DailyRoundsRoutingModule {}
