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
    ) {}

    public loadApi(): Observable<boolean> {
        return this.$http.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`, 'callback')
		.pipe(
			map(() => true) ,
			catchError(() => of(false)),
		); 
    }

	public loadGeocodeForAddress(address: string): Observable<any> {
		return this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${environment.googleMapsApiKey}`);
	}
}