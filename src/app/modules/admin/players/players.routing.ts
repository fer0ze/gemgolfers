import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from './contacts.guards';
import { ContactsDetailsComponent } from './details/details.component';
import { PlayerComponent } from './player/player.component';
import { PlayersComponent } from './players.component';

export const playerRoutes: Route[] = [
    {
        path     : '',
        component: PlayersComponent,
       
        children : [
            {
                path     : '',
                component: PlayerComponent,
                
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
