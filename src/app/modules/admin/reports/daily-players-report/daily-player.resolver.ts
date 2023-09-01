import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { Constants } from 'app/shared/classes/general';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { DailyReportService } from './daily-player.service';

@Injectable({
    providedIn: 'root',
})
export class DailyPlayerReportResolver implements Resolve<any> {
    loggedInuser: any;
    /**
     * Constructor
     */
    constructor(
        private _reportService: DailyReportService,
        private _datePipe: DatePipe,
        private _localStorage: LocalStorageService
    ) {
        //this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
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
        let lastWeekSunday = this.lastSevenDayDate();
        let lastWeekMonday = this.currentDate();
        let todayDate = this.today();

        return this._reportService.getData(
            '-LUFS3FCQKOGpJ2IEHmf',
            this._datePipe.transform(
                lastWeekSunday.toString(),
                'yyyy-MM-dd'
            ),
            this._datePipe.transform(
                lastWeekMonday.toString(),
                'yyyy-MM-dd'
            )
        );

    }

    public lastSevenDayDate(): string {
        const currentDate = new Date();

        // Get the date 7 days ago
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);

        // Format the dates in the desired format (YYYY-MM-DD)
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);

        // console.log('Current Date:', formattedCurrentDate);
        // console.log('7 Days Ago:', formattedSevenDaysAgo);

        return formattedSevenDaysAgo;
    }
    public currentDate(): string {
        const currentDate = new Date();
        // Format the dates in the desired format (YYYY-MM-DD)
        const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

        return formattedCurrentDate;
    }
    public today() {
        let date = new Date();
        return new Date(date.setDate(date.getDate()));
    }
}
