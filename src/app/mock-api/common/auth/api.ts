import { Injectable } from '@angular/core';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Utf8 from 'crypto-js/enc-utf8';
import { cloneDeep } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { FacadeService } from 'app/shared/services/facade.service';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { Constants, General } from 'app/shared/classes/general';
import { UserSessionModel } from 'app/shared/models/player.model';


@Injectable({
    providedIn: 'root'
})
export class AuthMockApi {
    private readonly _secret: any;
    private _user: any = userData;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private afAuth: AngularFireAuth,
        private _facadeService: FacadeService,
        private _localStorage: LocalStorageService
    ) {
        // Set the mock-api
        this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';

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
        // @ Forgot password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onPost('api/auth/forgot-password', 1000).reply(({ request }): [number, any] | Observable<any> => {
            return new Observable((observer) => {
                (async () => {
                    try {
                        const email = request.body;

                        // Now, initiate the password reset process in Firebase
                        try {
                            await this.afAuth.sendPasswordResetEmail(email);

                            // Password reset email sent successfully
                            //console.log('Password reset email sent successfully');

                            observer.next([200, true]);
                            observer.complete();
                        } catch (error) {
                            // Handle any errors that occur during the password reset process
                            console.error('Error sending password reset email:', error);

                            observer.next([500, false]);
                            observer.complete();
                        }
                    } catch (error) {
                        // Invalid credentials or other error occurred
                        // Handle other cases as needed
                        console.error('Error:', error);

                        // Invalid credentials
                        observer.next([404, false]);
                        observer.complete();
                    }
                })();
            });
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Reset password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/reset-password', 1000)
            .reply(() =>
                [
                    200,
                    true
                ]
            );

        // -----------------------------------------------------------------------------------------------------
        // @ Sign in - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in', 1500)
            .reply(({ request }): [number, any] | Observable<any> => {
                return new Observable((observer) => {
                    (async () => {
                        try {
                            const { email, password } = request.body;

                            // Sign in using Firebase Authentication
                            const response = await this.afAuth.signInWithEmailAndPassword(email, password);
                            const firebaseUser = response.user;
                            // Sign in successful
                            if (firebaseUser) {

                                const idToken = await firebaseUser.getIdToken();
                                // console.log(idToken);


                                this._facadeService.getPlayerByEmailLogin(email).subscribe((user: any) => {
                                    // console.log(user);
                                    if (user) {
                                        let userSession: UserSessionModel = this._localStorage.initiateUserSession(user[0]);
                                        this._user.name = user[0].firstName + " " + user[0].lastName;
                                        this._user.email = user[0].email;
                                        let clubInfo: any =
                                            user[0].membership.length > 0
                                                ? user[0].membership[0].club
                                                : null;
                                        let logo =
                                            clubInfo && clubInfo.logo
                                                ? clubInfo.logo
                                                : 'e2esp.png';
                                        this._user.avatar = 'assets/images/logo/' + logo + '';
                                        // user[0].tour_admin.length > 0 ? user[0].userRole = 4 : user[0].userRole;
                                        //this._user.role = user[0].role[0].length > 0 ? user[0].role[0].id : null;
                                        // if (user[0].permissions?.leagueAdmin && user[0].permissions?.tourAdmin) {
                                        //     user[0].userRole = 13;
                                        // } else if (user[0].permissions?.tourAdmin) {
                                        //     user[0].userRole = 4;
                                        // } else if (user[0].permissions?.leagueAdmin) {
                                        //     user[0].userRole = 9;
                                        // }

                                        // this._localStorage.set(Constants.LOGGED_IN_USER, user[0]);
                                        observer.next([
                                            200,
                                            {
                                                user: cloneDeep(firebaseUser),
                                                accessToken: idToken,
                                                tokenType: 'bearer',
                                                session: userSession,
                                            }
                                        ]);
                                        observer.complete();
                                    } else {
                                        observer.next([404, false]);
                                        observer.complete();
                                    }

                                })


                            }
                        } catch (error) {
                            // Invalid credentials or other error occurred
                            console.error(error);
                            // Invalid credentials
                            observer.next([404, false]);
                            observer.complete();
                        }


                    })();
                });
            });



        // -----------------------------------------------------------------------------------------------------
        // @ Sign in using the access token - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in-with-token')
            .reply(({ request }) => {

                // Get the access token
                const accessToken = request.body.accessToken;

                // Verify the token
                if (this._verifyJWTToken(accessToken)) {
                    return [
                        200,
                        {
                            user: cloneDeep(this._user),
                            accessToken: accessToken, //this._generateJWTToken(),
                            tokenType: 'bearer'
                        }
                    ];
                }

                // Invalid token
                return [
                    401,
                    {
                        error: 'Invalid token'
                    }
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign up - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onPost('api/auth/sign-up', 1000).reply(({ request }): [number, any] | Observable<any> => {

            return new Observable((observer) => {
                (async () => {
                    try {
                        const { email, password } = request.body;

                        // Now, initiate the password reset process in Firebase
                        try {
                            let res = await this.afAuth.createUserWithEmailAndPassword(email, password);
                            if (res) {
                                let user = General.createUser(request.body, res?.user?.uid);
                                this._facadeService.AddPlayer(user).then((res) => {
                                    if (res) {
                                        observer.next([200, true]);
                                        observer.complete();
                                    } else {
                                        observer.next([404, false]);
                                        observer.complete();
                                    }
                                })
                            } else {
                                observer.next([404, false]);
                                observer.complete();
                            }
                            // Password reset email sent successfully
                            // //console.log('Password reset email sent successfully');

                            // observer.next([200, true]);
                            // observer.complete();
                        } catch (error) {
                            // Handle any errors that occur during the password reset process
                            console.error(error);

                            observer.next([500, false]);
                            observer.complete();
                        }
                    } catch (error) {
                        // Invalid credentials or other error occurred
                        // Handle other cases as needed
                        console.error('Error:', error);

                        // Invalid credentials
                        observer.next([404, false]);
                        observer.complete();
                    }
                })();
            });
        });

        // -----------------------------------------------------------------------------------------------------
        // @ Unlock session - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/unlock-session', 1500)
            .reply(({ request }) => {

                // Sign in successful
                if (request.body.email === 'hughes.brian@company.com' && request.body.password === 'admin') {
                    return [
                        200,
                        {
                            user: cloneDeep(this._user),
                            accessToken: this._generateJWTToken(),
                            tokenType: 'bearer'
                        }
                    ];
                }

                // Invalid credentials
                return [
                    404,
                    false
                ];
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Return base64 encoded version of the given string
     *
     * @param source
     * @private
     */
    private _base64url(source: any): string {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    /**
     * Generates a JWT token using CryptoJS library.
     *
     * This generator is for mocking purposes only and it is NOT
     * safe to use it in production frontend applications!
     *
     * @private
     */
    private _generateJWTToken(): string {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'Fuse',
            exp: exp
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this._base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, this._secret);
        signature = this._base64url(signature);

        // Build and return the token
        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }

    /**
     * Verify the given token
     *
     * @param token
     * @private
     */
    private _verifyJWTToken(token: string): boolean {
        // Split the token into parts
        const parts = token.split('.');
        const header = parts[0];
        const payload = parts[1];
        const signature = parts[2];

        // Re-sign and encode the header and payload using the secret
        const signatureCheck = this._base64url(HmacSHA256(header + '.' + payload, this._secret));

        // Verify that the resulting signature is valid
        return true; // (signature === signatureCheck);
    }
}
