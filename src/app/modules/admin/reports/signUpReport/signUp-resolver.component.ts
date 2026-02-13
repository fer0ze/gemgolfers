import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FacadeService } from 'app/shared/services/facade.service';
import { BehaviorSubject, Observable, catchError, throwError, } from 'rxjs';
import { SignUpService } from './signUp-service';
@Injectable({
    providedIn: 'root'
})
export class Resolver  {

    /**
     * Constructor
     */
    constructor( private _projectService: SignUpService) {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._projectService.getData();
    }
}