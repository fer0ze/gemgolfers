import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { LayoutLeaderComponent } from './layout-leader.component';
@NgModule({
    declarations: [
        LayoutLeaderComponent
    ],
    imports     : [
        CommonModule,
        EmptyLayoutModule
    ],
})
export class LayoutLeaderModule
{
}
