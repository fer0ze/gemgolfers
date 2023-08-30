import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Query from '../../../../shared/GraphQL/tournament.gql';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private apollo: Apollo) {}

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
        id?: string,
        clubId?: string,
        fromDate?: any,
        toDate?: any
    ): Observable<any> {
        if (id) {
            return this.apollo
                .subscribe<any>({
                    query: Query.getallDashboard,
                    variables: {
                        adminId: id,
                        adminClubId: clubId,
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .pipe(
                    tap((response: any) => {
                        this._data.next(response);
                    })
                );
        } else {
            return this.apollo
                .subscribe<any>({
                    query: Query.getAllAdmin,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .pipe(
                    tap((response: any) => {
                        this._data.next(response);
                    })
                );
        }
    }
}
