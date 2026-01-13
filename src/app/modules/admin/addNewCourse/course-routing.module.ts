import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CourseComponent } from './course.component';
import { ViewCourseComponent } from '../course/view-course/view-course.component';

const routes:Routes=[

    {
        path: 'add',
        component: ViewCourseComponent, 
    },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class CourseRoutingModule { }