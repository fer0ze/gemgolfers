import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    defaultNavigation
} from 'app/mock-api/common/navigation/data';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';

@Injectable({
    providedIn: 'root',
})
export class NavigationMockApi {
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private loggedInuser: any;
    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _localStorage: LocalStorageService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        // this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        // //console.log(this.loggedInuser);

        this._fuseMockApiService.onGet('api/common/navigation').reply(() => {

            // // Fill compact navigation children using the default navigation
            // this._compactNavigation.forEach((compactNavItem) => {
            //     this._defaultNavigation.forEach((defaultNavItem) => {
            //         if ( defaultNavItem.id === compactNavItem.id )
            //         {
            //             compactNavItem.children = cloneDeep(defaultNavItem.children);
            //         }
            //     });
            // });
            // // Fill compact navigation children using the default navigation
            // // this._defaultNavigationSuperAdmin.forEach((compactNavItem) => {
            // //     this._defaultNavigation.forEach((defaultNavItem) => {
            // //         if ( defaultNavItem.id === compactNavItem.id )
            // //         {
            // //             compactNavItem.children = cloneDeep(defaultNavItem.children);
            // //         }
            // //     });
            // // });
            // this._sectaryNavigation.forEach((compactNavItem) => {
            //     this._defaultNavigation.forEach((defaultNavItem) => {
            //         if ( defaultNavItem.id === compactNavItem.id )
            //         {
            //             compactNavItem.children = cloneDeep(defaultNavItem.children);
            //         }
            //     });
            // });

            // // Fill futuristic navigation children using the default navigation
            // this._futuristicNavigation.forEach((futuristicNavItem) => {
            //     this._defaultNavigation.forEach((defaultNavItem) => {
            //         if ( defaultNavItem.id === futuristicNavItem.id )
            //         {
            //             futuristicNavItem.children = cloneDeep(defaultNavItem.children);
            //         }
            //     });
            // });

            // // Fill horizontal navigation children using the default navigation
            // this._horizontalNavigation.forEach((horizontalNavItem) => {
            //     this._defaultNavigation.forEach((defaultNavItem) => {
            //         if ( defaultNavItem.id === horizontalNavItem.id )
            //         {
            //             horizontalNavItem.children = cloneDeep(defaultNavItem.children);
            //         }
            //     });
            // });

            // Return the response
            return [
                200,
                {
                    default: cloneDeep(this._defaultNavigation),
                }
            ];

        });
    }
}
