import { resolve } from '@angular/compiler-cli';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { Player } from 'app/shared/models/player.model';
import { FacadeService } from 'app/shared/services/facade.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    show: Promise<boolean>;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private facade: FacadeService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [''],
        });
        this.show = Promise.resolve(true);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    async signIn() {
        this.show = Promise.resolve(false);
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        let isAdmin = <Player>(
            await this.facade.getPlayerByEmailLogin(this.signInForm.value.email)
        );
        if (isAdmin && isAdmin[0] && isAdmin[0].adminClubId) {
            localStorage.setItem('aXNMb2dnZWRJbg', JSON.stringify(isAdmin[0]));
        }
        const isLoggedin = <boolean>(
            await this._authService.login(
                this.signInForm.value.email,
                this.signInForm.value.password
            )
        );
        if (isLoggedin) {
            this.show = Promise.resolve(false);

            if (isAdmin && isAdmin[0] && isAdmin[0].adminClubId) {
                // const redirectURL =
                //     this._activatedRoute.snapshot.queryParamMap.get(
                //         'redirectURL'
                //     ) || '/signed-in-redirect';

                // // Navigate to the redirect url

                // console.log(redirectURL);
                //this.signInForm.enable();
                this.show = Promise.resolve(true);
                this._router.navigateByUrl('/dashboard');
            } else {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };

                // Show the alert
                this.showAlert = true;
                this.show = Promise.resolve(true);
                return;
                //this.isLoading = false;

                // this.snackBar.open('Authentication failed.', 'x', {
                //     duration: 5000,
                // });
            }
        } else {
            console.log('false');
            // Re-enable the form
            this.signInForm.enable();

            // Reset the form
            this.signInNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Wrong email or password',
            };

            // Show the alert
            this.showAlert = true;
            this.show = Promise.resolve(true);
            return;
        }

        ///localStorage.setItem('aXNMb2dnZWRJbg', JSON.stringify(isAdmin[0]));
        //localStorage.setItem('adminClubID', '-LUFS3FAg4OEhIiK0vgY');
        // Sign in
        // await this._authService
        //     .login(this.signInForm.value.email, this.signInForm.value.password)
        //     .then(
        //         async(result) => {
        //         const redirectURL =
        //             this._activatedRoute.snapshot.queryParamMap.get(
        //                 'redirectURL'
        //             ) || '/signed-in-redirect';

        //         // Navigate to the redirect url

        //         console.log(redirectURL);

        //         this._router.navigateByUrl(redirectURL);
        //         this.show = Promise.resolve(true);
        //     })
        //     .catch((err) => {
        //         this.signInForm.enable();

        //         // Reset the form
        //         this.signInNgForm.resetForm();

        //         // Set the alert
        //         this.alert = {
        //             type: 'error',
        //             message: 'Wrong email or password',
        //         };

        //         // Show the alert
        //         this.showAlert = true;
        //         return;
        //     })
        //     .finally(() => {

        //         console.log(3);

        //         // const redirectURL =
        //         //     this._activatedRoute.snapshot.queryParamMap.get(
        //         //         'redirectURL'
        //         //     ) || '/signed-in-redirect';

        //         // // Navigate to the redirect url

        //         // console.log(redirectURL);
        //         // this._router.navigateByUrl(redirectURL);
        //         //this.show = Promise.resolve(true);
        //     });
        // console.log(log);
        // if (log) {
        //     const redirectURL =
        //         this._activatedRoute.snapshot.queryParamMap.get(
        //             'redirectURL'
        //         ) || '/signed-in-redirect';

        //     // Navigate to the redirect url
        //     console.log(log);
        //     console.log(redirectURL);

        //     this._router.navigateByUrl(redirectURL);
        // } else {
        //     console.log('Error');
        // }
        // this._authService.signIn(this.signInForm.value).subscribe(
        //     () => {
        //         console.log('2');

        //         // Set the redirect url.
        //         // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
        //         // to the correct page after a successful sign in. This way, that url can be set via
        //         // routing file and we don't have to touch here.
        //         const redirectURL =
        //             this._activatedRoute.snapshot.queryParamMap.get(
        //                 'redirectURL'
        //             ) || '/signed-in-redirect';

        //         // Navigate to the redirect url
        //         this._router.navigateByUrl(redirectURL);
        //     },
        //     (response) => {
        //         console.log(response);

        //         // Re-enable the form
        //         this.signInForm.enable();

        //         // Reset the form
        //         this.signInNgForm.resetForm();

        //         // Set the alert
        //         this.alert = {
        //             type: 'error',
        //             message: 'Wrong email or password',
        //         };

        //         // Show the alert
        //         this.showAlert = true;
        //     }
        // );
    }
}
