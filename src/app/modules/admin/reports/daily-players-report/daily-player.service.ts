import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Query from '../../../../shared/GraphQL/tournament.gql';
import { from } from 'apollo-link';
import { mapDashboardData } from 'app/shared/helper/dashboardmapper';

@Injectable({
    providedIn: 'root',
})
export class DailyReportService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private apollo: Apollo) { }

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
    getData(
        courseId: string,
        fromDate: any,
        toDate: any,

    ): Observable<any> {
        console.log(fromDate);
        console.log(toDate);

        return this.apollo
            .subscribe<any>({
                query: Query.DailyRoundsSecateryQuery,
                variables: {
                    courseId: courseId,
                    fromDate: fromDate,
                    toDate: toDate,
                },
            })
            .pipe(
                map((item) => mapDashboardData(item.data)),
                tap((mappedData) => {
                    // Set the mapped data as the new value of the BehaviorSubject
                    this._data.next(mappedData);
                })
            )
            .pipe(map(() => undefined));

    }
}
