import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HandicapService {
    constructor(private $http: HttpClient) {}

    calculateHandicap(obj):Promise<any> {
        return this.$http.post(
            'https://gemgolfers-api.herokuapp.com/handicap/revertAndReCalculateHcCongo',
            obj
        ).toPromise();
    }
    calculatePlayerHandicap(obj):Promise<any> {
        return this.$http.post(
            'https://gemgolfers-api.herokuapp.com/handicap/calculateHandicapForPlayer',
            obj
        ).toPromise();
    }
    calculateHandicapWHS(obj):Promise<any> {
        return this.$http.post(
            'https://gemgolfers-api.herokuapp.com/handicap/revertAndReCalculateHcWHS',
            obj
        ).toPromise();
    }
    adjustHandicapWHS(obj):Promise<any> {
        return this.$http.post(
            'https://gemgolfers-api.herokuapp.com/handicap/adjustSelectedHcDiff',
            obj
        ).toPromise();
    }
}