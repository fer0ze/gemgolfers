import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import * as auth from 'firebase/auth';
import { user as userData } from 'app/mock-api/common/user/data';
import { Constants } from 'app/shared/classes/general';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private _user: any = userData;
    private loggedInuser: any;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        public afs: AngularFirestore, // Inject Firestore service
        public firebaseAuth: AngularFireAuth,
        private _api: AuthMockApi
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    async login(email: string, password: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.firebaseAuth
                .signInWithEmailAndPassword(email, password)
                .then((value) => {
                    //console.log('Success!', value);
                    //localStorage.setItem('authToken', JSON.stringify(value.user.getIdToken()));

                    const token = value.user
                        .getIdToken(false)
                        .then((authToken) => {
                            this.accessToken = this._api._generateJWTToken();

                            // Set the authenticated flag to true
                            this._authenticated = true;
                            this.loggedInuser = JSON.parse(
                                localStorage.getItem(Constants.LOGGED_IN_USER)
                            );
                            let clubInfo: any =
                                this.loggedInuser.membership.length > 0
                                    ? this.loggedInuser.membership[0].club
                                    : null;
                            let logo =
                                clubInfo && clubInfo.logo
                                    ? clubInfo.logo
                                    : 'e2esp.png';
                            this._user.email = this.loggedInuser.email;
                            this._user.name = this.loggedInuser.fullName;
                            this._user.avatar =
                                'assets/images/logo/' + logo + '';
                            // Store the user on the user service
                            this._userService.user = this._user;
                            this._authenticated = true;
                            // localStorage.setItem('accessToken', this._api._generateJWTToken());
                            // localStorage.setItem('gotAuthentication', 'true');
                        });

                    //this.firebaseAuth.user.subscribe(a=> { console.log(a.providerData[0]); });

                    //console.log('Nice, it worked!');
                    resolve(true);
                })
                .catch((err) => {
                    console.log('Something went wrong:', err.message);
                    resolve(false);
                });
        });
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('aXNMb2dnZWRJbg');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
