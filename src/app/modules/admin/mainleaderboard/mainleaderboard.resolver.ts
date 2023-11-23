// import { Injectable } from '@angular/core';
// import {
//     ActivatedRouteSnapshot,
//     Resolve,
//     Router,
//     RouterStateSnapshot,
// } from '@angular/router';
// import { Observable } from 'rxjs';
// import { LogsService } from 'app/shared/services/logs.service';
// import { LeaderboardService } from './mainleaderboard.service';

// @Injectable({
//     providedIn: 'root',
// })
// export class LeaderboardResolver implements Resolve<any> {
//     loggedInuser: any;
//     /**
//      * Constructor
//      */
//     constructor(
//         private _leaderBoardService: LeaderboardService,
//         private logger: LogsService
//     ) {

//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Resolver
//      *
//      * @param route
//      * @param state
//      */
//     // resolve(
//     //     route: ActivatedRouteSnapshot,
//     //     state: RouterStateSnapshot
//     // ): Observable<any> {
//     //     try {
//     //         this.logger.log('Getting LeaderBoard Data', "info");
//     //         return this._leaderBoardService.getData(route.paramMap.get('id'));
//     //     } catch (error) {
//     //         this.logger.log('Getting LeaderBoard Data Failed', "error", error.toString());
//     //     }
//     // }
// }
