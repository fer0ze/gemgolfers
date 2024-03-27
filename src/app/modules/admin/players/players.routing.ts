import { Route } from '@angular/router';
import { ContactsDetailsComponent } from './details/details.component';
import { PlayersComponent } from './players.component';
import { ViewPlayerComponent } from './view-player/view-player.component';
import { PlayerResolver } from './players.resolver';

export const playerRoutes: Route[] = [
    {
        path: '',
        component: PlayersComponent,
        // resolve: {
        //     players: PlayerResolver
        // }
    },
    {
        path: 'add',
        component: ContactsDetailsComponent,
    },
    {
        path: 'view/:id',
        component: ContactsDetailsComponent,
    },
    {
        path: 'viewProfile/:id',
        component: ViewPlayerComponent,
    },
];
