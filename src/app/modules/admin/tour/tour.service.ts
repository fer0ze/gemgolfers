import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Query from '../../../shared/GraphQL/tournament.gql';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    loggedInuser: any;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private apollo: Apollo,
     
        private logger: LogsService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    setData(newData: any) {
        this._data.next(newData);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getTours(id: String): Observable<any> {
        return this.apollo
            .subscribe<any>({
                query: Query.getTours,
                variables: {
                    adminId: id,
                },
            })
            .pipe(
                tap((response: any) => {
                    this.logger.log(
                        'Getting Tour Dashboard Data Successfull',
                        'info'
                    );
                    this._data.next(response['data']['tour']);
                })
            );
    }
}
