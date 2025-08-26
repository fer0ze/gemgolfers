import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HandicapService {
    constructor(private $http: HttpClient) { }
    private apiUrl = 'https://api.countrystatecity.in/v1';
    calculateHandicap(obj): Promise<any> {
        return this.$http.post(`${environment.handicapApiURL}/handicap/revertAndReCalculateHcCongo`,
            obj
        ).toPromise();
    }
    calculatePlayerHandicap(obj): Promise<any> {
        return this.$http.post(
            `${environment.handicapApiURL}/handicap/calculateHandicapForPlayer`,
            obj
        ).toPromise();
    }
    calculateHandicapWHS(obj): Promise<any> {
        return this.$http.post(
            `${environment.handicapApiURL}/handicap/revertAndReCalculateHcWHS`,
            obj
        ).toPromise();
    }
    adjustHandicapWHS(obj): Promise<any> {
        return this.$http.post(
            `${environment.handicapApiURL}/handicap/adjustSelectedHcDiff`,
            obj
        ).toPromise();
    }
    flightEndedTrigger(obj): Promise<any> {
        return this.$http.post(
            `${environment.handicapApiURL}/triggers/updateFlightEndedField`,
            obj
        ).toPromise();
    }
    unFreezePlayerHandicap(obj: { playerId: string }) {
        return this.$http.post(`${environment.localURL}/triggers/calculateFreezeHandicap`, obj);
    }
    updatePlayerHandicapTee(obj): Promise<any> {
        return this.$http.post(
            `${environment.handicapApiURL}/handicap/calculateHandicapForPlayerBulk`,
            obj
        ).toPromise();
    }
}