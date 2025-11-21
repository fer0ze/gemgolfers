import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Crypto } from 'app/shared/classes/crypto';
import { UserSessionModel } from '../models/player.model';

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

    initiateUserSession(user: any): UserSessionModel {
        let roles: { id: number; name: string }[] = [];
        let modules: { id: string; name: string }[] = [];
        if (user.roles && user.roles.length > 0) {
            user.roles.forEach((r: any) => {
                if (r.role) {
                    let module = r.role?.access?.module;
                    roles.push(r.role);
                    if (module) {
                        modules.push(module);
                    }
                }
            })
        }

        let userSession: UserSessionModel = {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            picture: user.picture,
            clubId: user?.membership?.clubId ?? '',
            modules: modules,
            roles: roles,

        };
        return userSession;
    }

}