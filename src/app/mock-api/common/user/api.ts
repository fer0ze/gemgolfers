import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import { Constants } from 'app/shared/classes/general';

@Injectable({
    providedIn: 'root'
})
export class UserMockApi {
    private _user: any = userData;
    private loggedInuser: any;
    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        let clubInfo: any = (this.loggedInuser.membership.length > 0) ? this.loggedInuser.membership[0].club : null;
        let logo = (clubInfo && clubInfo.logo) ? clubInfo.logo : "e2esp.png";
        this._user.email = this.loggedInuser.email;
        this._user.name = this.loggedInuser.fullName;
        this._user.avatar = 'assets/images/logo/'+logo+'';
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
            .reply(() =>

                [200, cloneDeep(this._user)]);

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({ request }) => {

                // Get the user mock-api
                const user = cloneDeep(request.body.user);
                console.log(user);

                // Update the user mock-api
                this._user = assign({}, this._user, user);
                this.loggedInuser = JSON.parse(
                    localStorage.getItem(Constants.LOGGED_IN_USER)
                );
                let clubInfo: any = (this.loggedInuser.membership.length > 0) ? this.loggedInuser.membership[0].club : null;
                let logo = (clubInfo && clubInfo.logo) ? clubInfo.logo : "e2esp.png";
                this._user.email = this.loggedInuser.email;
                this._user.name = this.loggedInuser.fullName;
                this._user.avatar = 'assets/images/logo/{{' + logo + '}}';
                // Return the response
                return [200, cloneDeep(this._user)];
            });
    }
}
