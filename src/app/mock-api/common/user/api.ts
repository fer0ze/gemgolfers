import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { UserSessionModel } from 'app/shared/models/player.model';

@Injectable({
    providedIn: 'root',
})
export class UserMockApi {
    private _user: any = userData;
    private loggedInuser: UserSessionModel;
    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _localStorage: LocalStorageService) {
        // Register Mock API handlers
        this.registerHandlers();
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        if (this.loggedInuser) {
            let logo = this.loggedInuser.club?.logo ? this.loggedInuser.club.logo : 'e2esp.png';
            this._user.email = this.loggedInuser.email;
            this._user.name = this.loggedInuser.name;
            this._user.avatar = 'assets/images/logo/' + logo + '';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(() => [200, cloneDeep(this._user)]);

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({ request }) => {
                // Get the user mock-api
                const user = cloneDeep(request.body.user);

                // Update the user mock-api
                this._user = assign({}, this._user, user);
                // Return the response
                return [200, cloneDeep(this._user)];
            });
    }
}
