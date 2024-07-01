import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleMapsApiService {

    constructor(
        private $http: HttpClient,
    ) { }

    getLatLng(address: string): Observable<any> {
        let addressPbj = {
            "address": address
        };
        return this.$http.post(`${environment.handicapApiURL}/maps/getCountryLatLong`, addressPbj)
    }
}