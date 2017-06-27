import { Injectable } from "@angular/core";

import * as CryptoJS from "crypto-js";

@Injectable()
export class CryptoService {

    private static _initialized = false;
    private static _prime: string;
    private static _salt: string;
    private static _key: any;
    private static _iv: any;

    initialize(data: any) {
        CryptoService._prime = data.prime;
        CryptoService._key = CryptoJS.enc.Utf8.parse(CryptoService._prime);
        CryptoService._iv = CryptoJS.enc.Utf8.parse(CryptoService._prime);

        let plain = CryptoJS.enc.Utf8.parse(data.ipa).toString() + data.timestamp;
        let encrypted = CryptoJS.AES.encrypt(plain, CryptoService._key,
            {
                keySize: 128 / 8,
                iv: CryptoService._iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        CryptoService._salt = this.sha512(encrypted.toString());

        CryptoService._initialized = true;
    }

    encrypt(plainText: string): string {
        if (!CryptoService._initialized) {
            throw Error("Crypto service not initialized");
        }

        plainText = CryptoService._salt + plainText;
        let encrypted = CryptoJS.AES.encrypt(plainText, CryptoService._key,
            {
                keySize: 128 / 8,
                iv: CryptoService._iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    decrypt(cipherText: string): string {
        if (!CryptoService._initialized) {
            throw Error("Crypto service not initialized");
        }

        let decrypted = CryptoJS.AES.decrypt(cipherText, CryptoService._key,
            {
                keySize: 128 / 8,
                iv: CryptoService._iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        let plainText = decrypted.toString(CryptoJS.enc.Utf8);
        plainText = plainText.replace(CryptoService._salt, "");
        return plainText;
    }

    md5(plainText: string): string {
        return CryptoJS.MD5(plainText).toString();
    }

    sha512(plainText: string): string {
        return CryptoJS.SHA512(plainText).toString();
    }
}