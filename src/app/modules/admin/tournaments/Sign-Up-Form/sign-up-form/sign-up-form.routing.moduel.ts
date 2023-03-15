import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpFormComponent } from './sign-up-form.component';


const routes: Routes = [
    {
        path: '',
        component: SignUpFormComponent
    },
    {
        path: ':id',
        component: SignUpFormComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SignUpFormRoutingModule {}
