import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLeaderboardComponent } from './mainleaderboard.component';


const routes: Routes = [
    {
        path: '',
        component: MainLeaderboardComponent,
    },
    {
        path: ':id',
        component: MainLeaderboardComponent,
        // resolve: {
        //     data: LeaderboardResolver,
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainleaderboardRoutingModule {}
