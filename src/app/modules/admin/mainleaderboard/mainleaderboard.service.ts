import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';
import { LeaderboardSubscription } from 'app/shared/GraphQL/tournament.gql';

@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    loggedInuser: any;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private apollo: Apollo, private _localStorage: LocalStorageService, private logger: LogsService) { }

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
    // getData(prefix?: string): Observable<any> {
    //     return this.apollo
    //         .watchQuery({
    //             query: LeaderboardSubscription,
    //             variables: {
    //                 tournamentPrefix: prefix,
    //             },
    //             pollInterval: 10000,
    //         })
    //         .valueChanges.pipe(
    //             map(({ data }) => {
    //                 //console.log(data);
    //                 this._data.next(data);
    //                 // return data; // You can return the data here if needed
    //             })
    //         );
    // }


}
