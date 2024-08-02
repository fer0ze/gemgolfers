import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { FacadeService } from 'app/shared/services/facade.service';
import { BehaviorSubject, Observable, catchError, throwError, } from 'rxjs';
import { UserActivityService } from './userActivityReport.service';
import { DatePipe } from '@angular/common';
@Injectable({
    providedIn: 'root'
})
export class Resolver implements Resolve<any> {

    /**
     * Constructor
     */
    constructor(private _projectService: UserActivityService,private datePipe: DatePipe) {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        var currentDate = new Date();
        const todayStart = this.datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00.000');
        const todayEnd = this.datePipe.transform(currentDate, 'yyyy-MM-ddT23:59:59.999');
        return this._projectService.getData(todayStart,todayEnd);
    }
}