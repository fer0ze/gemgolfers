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
        // this.show = Promise.resolve(true);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    async signIn() {
        // // Return if the form is invalid
        // if (this.signInForm.invalid) {
        //     return;
        // }

        // // Disable the form
        // this.signInForm.disable();

        // Hide the alert
        //this.showAlert = false;
        let isAdmin = <Player>(
            await this.facade.getPlayerByEmailLogin(this.signInForm.value.email)
        );
        if (isAdmin && isAdmin[0]) {
            localStorage.setItem('aXNMb2dnZWRJbg', JSON.stringify(isAdmin[0]));
        }
        // let isLoggedin;
        // await this._authService
        //     .login(this.signInForm.value.email, this.signInForm.value.password)
        //     .then((response) => {
        //         isLoggedin = response;
        //     })
        //     .catch((err) => {
        //         isLoggedin = err;
        //     });

        // if (isAdmin && isAdmin[0] && isLoggedin) {
        //     const redirectURL =
        //         this._activatedRoute.snapshot.queryParamMap.get(
        //             'redirectURL'
        //         ) || '/signed-in-redirect';

        //     //Navigate to the redirect url
        //     this._router.navigateByUrl(redirectURL);
        //     console.log(redirectURL);
        //     //this.signInForm.enable();

        //    // window.location.reload();
        // } else {
        //     localStorage.removeItem('accessToken');
        //     localStorage.removeItem('aXNMb2dnZWRJbg');
        //     console.log('false');
        //     // Re-enable the form
        //     this.signInForm.enable();

        //     // Reset the form
        //     this.signInNgForm.resetForm();

        //     // Set the alert
        //     this.alert = {
        //         type: 'error',
        //         message: 'Wrong email or password',
        //     };

        //     // Show the alert
        //     this.showAlert = true;
        //     // this.show = Promise.resolve(true);
        //     return;
        // }
         // Return if the form is invalid
         if ( this.signInForm.invalid )
         {
             return;
         }
 
         // Disable the form
         this.signInForm.disable();
 
         // Hide the alert
         this.showAlert = false;
 
         // Sign in
          this._authService.signIn(this.signInForm.value)
             .subscribe(
                 () => {
 
                     // Set the redirect url.
                     // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                     // to the correct page after a successful sign in. This way, that url can be set via
                     // routing file and we don't have to touch here.
                     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || 'signed-in-redirect';
 
                     // Navigate to the redirect url
                     //this._router.navigateByUrl(redirectURL)
                     window.location.reload();
 
                 },
                 (response) => {
 
                     // Re-enable the form
                     this.signInForm.enable();
                     localStorage.removeItem('accessToken');
                     localStorage.removeItem('aXNMb2dnZWRJbg');
                     // Reset the form
                     this.signInNgForm.resetForm();
 
                     // Set the alert
                     this.alert = {
                         type   : 'error',
                         message: 'Wrong email or password'
                     };
 
                     // Show the alert
                     this.showAlert = true;
                 }
             );
    }
}
