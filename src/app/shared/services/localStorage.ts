import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Crypto } from 'app/shared/classes/crypto';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor(private router: Router) { }

    public set(key: string, value: any) {
        localStorage.setItem(key, Crypto.encryptData(value));
    }
    
    get(key: string): any {
        return Crypto.decryptData(localStorage.getItem(key));
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }
}