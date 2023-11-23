import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Crypto } from 'app/shared/classes/crypto';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor(private router: Router) { }

    public set(key: string, value: object) {
        localStorage.setItem(key, Crypto.encryptData(value));
    }
    public setTourId(key: string, value: any) {
        localStorage.setItem(key, Crypto.encryptData(value));
    }

    get(key: string): any {
        let user = Crypto.decryptData(localStorage.getItem(key));

        if (!user) {
            this.router.navigate(['/sign-out']);

            return null;
        }

        return user;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}