import { Route } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const profilesRoutes: Route[] = [
    {
        path     : ':id',
        component: ProfileComponent,
    }
];
