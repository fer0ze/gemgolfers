import { Injectable } from '@angular/core';
import { Crypto } from 'app/shared/classes/crypto';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    constructor() { }

    public set(key: string, value: object) {
        localStorage.setItem(key, Crypto.encryptData(value));
    }
    public setTourId(key: string, value: any) {
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