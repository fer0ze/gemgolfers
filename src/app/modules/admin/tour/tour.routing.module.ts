import { Route } from '@angular/router';
import { TourComponent } from './tour.component';
import { TourResolver } from './tour.resolver';
import { DetailTourComponent } from './detail/detailTour.component';


export const tourRoutes: Route[] = [
    {
        path: '',
        component: TourComponent,
        resolve: {
            data: TourResolver
        }
    },
    {
        path: ':id',
        component: DetailTourComponent,
    },
    // {
    //     path: 'view/:id',
    //     component: ContactsDetailsComponent,
    // },
    // {
    //     path: 'viewProfile/:id',
    //     component: ViewPlayerComponent,
    // },
];
