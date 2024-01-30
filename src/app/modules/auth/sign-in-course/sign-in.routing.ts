import { Route } from '@angular/router';
import { AuthSignInCourseComponent } from './sign-in.component';
// import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';

export const authSignInRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignInCourseComponent
    }
];
