import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { Constants } from 'app/shared/classes/general';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'app/shared/services/localStorage';

@Injectable({
    providedIn: 'root',
})
export class ProjectResolver implements Resolve<any> {
    loggedInuser: any;
    /**
     * Constructor
     */
    constructor(
        private _projectService: ProjectService,
        private _datePipe: DatePipe, private _localStorage: LocalStorageService, private _router: Router,
    ) {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        console.log('In Resolver');
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        let lastWeekSunday = this.lastWeekSunday();
        let lastWeekMonday = this.lastWeekMonday();
        if (this.loggedInuser.userRole === 1) {
            return this._projectService.getData(
                null, null,
                this._datePipe.transform(
                    lastWeekSunday.toString(),
                    'yyyy-MM-dd'
                ),
                this._datePipe.transform(
                    lastWeekMonday.toString(),
                    'yyyy-MM-dd'
                )
            );
        } else if (this.loggedInuser.userRole === 2) {
            return this._projectService.getData(
                this.loggedInuser.id,
                this.loggedInuser.adminClubId,
                this._datePipe.transform(
                    lastWeekSunday.toString(),
                    'yyyy-MM-dd'
                ),
                this._datePipe.transform(
                    lastWeekMonday.toString(),
                    'yyyy-MM-dd'
                )
            );
        } else if (this.loggedInuser.userRole == 8) {
            this._router.navigateByUrl('/reports/dailyPlayer').catch((error) => {
                console.error('Navigation error:', error);
            });
        }
    }

    private lastWeekMonday(): Date {
        //let date = new Date();
        //return new Date(date.setDate(date.getDate() - 8));
        let date = new Date();
        let day = date.getDay();
        let prevMonday = new Date();
        if (date.getDay() == 0) {
            prevMonday.setDate(date.getDate() - 7);
        } else {
            prevMonday.setDate(date.getDate() - (day + 6));
        }

        return prevMonday;
    }
    private lastWeekSunday(): Date {
        let date = new Date();
        let day = date.getDay();
        let prevSunday = new Date();
        if (date.getDay() == 7) {
            prevSunday.setDate(date.getDate() - 7);
        } else {
            prevSunday.setDate(date.getDate() - day);
        }

        return prevSunday;
    }
}
