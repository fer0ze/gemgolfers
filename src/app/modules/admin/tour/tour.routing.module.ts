import { Route } from '@angular/router';
import { TourComponent } from './tour.component';
import { TourResolver } from './tour.resolver';
import { DetailTourComponent } from './detail/detailTour.component';
import { TourGuideComponent } from './guides/guide.component';


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
    {
        path: 'guides/:id',
        component: TourGuideComponent,
    },
    // {
    //     path: 'viewProfile/:id',
    //     component: ViewPlayerComponent,
    // },
];
