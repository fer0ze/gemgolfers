import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { UserSessionModel } from 'app/shared/models/player.model';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _localStorage = inject(LocalStorageService);
    private _loggedInUser: UserSessionModel;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                console.log(navigation);
                this._loggedInUser = this._localStorage.get(Constants.LOGGED_IN_USER);
                if (this._loggedInUser) {
                    // console.log(this._loggedInUser);

                    const userModuleAccess = this._loggedInUser.modules.map(m => m.id);
                    const isSuperAdmin = this._localStorage.isSuperAdmin();

                    // Filter navigation
                    const filteredDefaultNavigation = navigation['default']
                        .map((navItem: any) => {

                            // If nav item has children, filter them
                            if (navItem.children?.length) {
                                const filteredChildren = navItem.children.filter(child => {
                                    if (child.meta?.superAdminOnly && !isSuperAdmin) return false;
                                    if (child.meta?.superAdminOnly && isSuperAdmin) return true;
                                    return userModuleAccess.includes(child.moduleId);
                                });

                                // Return updated item with filtered children
                                return {
                                    ...navItem,
                                    children: filteredChildren
                                };
                            }

                            // No children → just check parent moduleId
                            return userModuleAccess.includes(navItem.moduleId) ? navItem : null;
                        })
                        .filter(navItem => {
                            if (!navItem) return false;

                            // Remove parents with no allowed children AND without their own permission
                            if (navItem.children?.length === 0 && !userModuleAccess.includes(navItem.moduleId)) {
                                return false;
                            }

                            return true;
                        });

                    const updatedNavigation = {
                        ...navigation,
                        default: filteredDefaultNavigation,
                    };

                    this._navigation.next(updatedNavigation);
                }

            })
        );
    }
}
