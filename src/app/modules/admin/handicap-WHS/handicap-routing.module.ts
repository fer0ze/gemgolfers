import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HandicapsComponent } from './WHS/handicaps.component';
import { HandicapComponent } from './handicap.component';
import { CanDeactivateHandicapDetails } from './handicap.guards';
import { PlayerHandicapComponent } from './player-handicap/player-handicaps.component';

export const HandicapRoutingModule: Route[] = [
    {
        path: '',
        component: HandicapComponent,
        children: [
            {
                path: '',
                component: HandicapsComponent,

                children: [
                    {
                        path: ':id',
                        component: PlayerHandicapComponent,
                        canDeactivate: [CanDeactivateHandicapDetails],
                    },
                ],
            },
        ],
    },
];
