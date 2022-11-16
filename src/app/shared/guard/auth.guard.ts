import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

import { AngularFireAuth }  from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import "firebase/database";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private firebaseAuth: AngularFireAuth) {
        this.firebaseAuth.authState.subscribe(async res => {
            if (res && res.uid) {
                //user logged in
            } else {
              this.router.navigate(['/login']);
            }
          });
    }

    canActivate() {
        if (localStorage.getItem('aXNMb2dnZWRJbg')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
