import { Route } from '@angular/router';
import { ClubsListComponent } from './clubs-list/clubs-list.component';
import { ClubDetailsComponent } from './club-details/club-details.component';
import { ClubViewComponent } from './club-view/club-view.component';

export const clubsRoutes: Route[] = [
    {
        path: '',
        component: ClubsListComponent,
    },
    {
        path: 'add',
        component: ClubDetailsComponent,
    },
    {
        path: 'edit/:id',
        component: ClubDetailsComponent,
    },
    {
        path: 'view/:id',
        component: ClubViewComponent,
    },
];
