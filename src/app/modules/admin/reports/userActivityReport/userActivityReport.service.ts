import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FacadeService } from 'app/shared/services/facade.service';

@Injectable({
    providedIn: 'root'
})
export class UserActivityService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private facadeService: FacadeService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(todayStart,todayEnd): Observable<any> {

        return this.facadeService.getPlayersActivityReport(todayStart,todayEnd).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }


    /**
     * Get data
     */
    getFilterData(currentDate, lastDate): Observable<any> {
        return this.facadeService.getPlayersActivityReport(currentDate, lastDate).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}
