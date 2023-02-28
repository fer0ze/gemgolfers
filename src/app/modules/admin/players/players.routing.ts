import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from './contacts.guards';
import { ContactsDetailsComponent } from './details/details.component';
import { PlayerComponent } from './player/player.component';
import { PlayersComponent } from './players.component';
import { ViewPlayerComponent } from './view-player/view-player.component';

export const playerRoutes: Route[] = [
    {
        path: '',
        component: PlayersComponent,

        children: [
            {
                path: '',
                component: PlayerComponent,

                children: [
                    {
                        path: 'view/:id',
                        component: ContactsDetailsComponent,
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                    {
                        path: 'add',
                        component: ContactsDetailsComponent,
                        canDeactivate: [CanDeactivateContactsDetails],
                    },
                ],
            },
        ],
    },
    {
        path: 'viewProfile/:id',
        component: ViewPlayerComponent,
    },
];
