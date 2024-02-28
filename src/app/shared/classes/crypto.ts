
import CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';

export class Crypto {
    
    static encryptData(data)  {

        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encryptSecretKey).toString();
        } catch (e) {
            //console.log(e);
        }
    }

    static decryptData(data) {

        try {

            if(data) {
                const bytes = CryptoJS.AES.decrypt(data, environment.encryptSecretKey);
                if (bytes.toString()) {
                    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                }
                return data;
            }
            
        } catch (e) {
            //console.log(e);
        }
    }
}