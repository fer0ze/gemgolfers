import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FacadeService } from 'app/shared/services/facade.service';

@Injectable({
    providedIn: 'root'
})
export class TourService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private facadeService: FacadeService) {
    }

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
    getData(): Observable<any> {
        return this.facadeService.getToursReport().pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Get data
     */
    getFilterData(currentDate, lastDate): Observable<any> {
        return this.facadeService.getToursListByDate(currentDate, lastDate).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Get data
     */
    deleteTours(deletedtournaments: any[]): Promise<boolean> {
        return this.facadeService.deleteTours(deletedtournaments).then(res => {
            return true;
        }).catch((error) => {
            console.error('Deletion failed:', error);
            return false; // Return false when there's an error during deletion
        });
    }
}
