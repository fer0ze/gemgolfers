import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import * as Query from '../../../../shared/GraphQL/tournament.gql';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    loggedInuser: any;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private apollo: Apollo,
        private _localStorage: LocalStorageService,
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
        try {
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
                            this.logger.log(
                                'Getting Dashboard Data Successfull',
                                'info'
                            );
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
                            this.logger.log(
                                'Getting Dashboard Data Successfull',
                                'info'
                            );
                            this._data.next(response);
                        })
                    );
            }
        } catch (error) {
            // Handle the error here or re-throw it if necessary
            console.error('An error occurred:', error);
            this.logger.log(
                'Getting Dashboard Data Failed',
                'error',
                error.toString()
            );
            throw error;
        }
    }
    getPlayerData(
        fromDate?: any,
        toDate?: any
    ): Observable<any> {
        try {
            return this.apollo
                .subscribe<any>({
                    query: Query.getPlayer,
                    variables: {
                        fromDate: fromDate,
                        toDate: toDate,
                    },
                })
                .pipe(
                    tap((response: any) => {
                        this.logger.log(
                            'Getting Player Data Successfull',
                            'info'
                        );
                        this._data.next(response);
                    })
                );
        } catch (error) {
            // Handle the error here or re-throw it if necessary
            console.error('An error occurred:', error);
            this.logger.log(
                'Getting Player Data Failed',
                'error',
                error.toString()
            );
            throw error;
        }
    }
    // getPlayerDataDashbaord(label: any): Observable<any> {
    //     try {
    //         let query;
    //         if (label == 'Club') {
    //             query = Query.getClubPlayer;
    //         } else if (label == 'Mobile') {
    //             query = Query.getMobilePlayer;
    //         } else if (label == 'Trail') {
    //             query = Query.getTrailPlayer;
    //         } else {
    //             query = Query.getPremiumPlayer;
    //         }
    //         return this.apollo
    //             .subscribe<any>({
    //                 query: query
    //             })
    //             .pipe(
    //                 tap((response: any) => {
    //                     this.logger.log(
    //                         'Getting Player Data Successfull',
    //                         'info'
    //                     );
    //                     this._data.next(response);
    //                 })
    //             );
    //     } catch (error) {
    //         // Handle the error here or re-throw it if necessary
    //         console.error('An error occurred:', error);
    //         this.logger.log(
    //             'Getting Player Data Failed',
    //             'error',
    //             error.toString()
    //         );
    //         throw error;
    //     }
    // }

    getTourData(id: String, fromDate?: any, toDate?: any): Observable<any> {
        return this.apollo
            .subscribe<any>({
                query: Query.getTourDashboard,
                variables: {
                    adminId: id,
                    fromDate: fromDate,
                    toDate: toDate,
                },
            })
            .pipe(
                tap((response: any) => {
                    this.logger.log(
                        'Getting Tour Dashboard Data Successfull',
                        'info'
                    );
                    this._data.next(response);
                })
            );
    }

    getTournamentData(id: String, fromDate?: any, toDate?: any): Observable<any> {
        return this.apollo
            .subscribe<any>({
                query: Query.getTournamentData,
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
                    this._data.next(response);
                })
            );
    }

}
