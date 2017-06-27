import { Injectable } from "@angular/core";
import { Routes } from "@angular/router";
import { OperationResult, UtilityService, DataService, CryptoService, MenuService } from "@framework";
import { Observable } from "rxjs/Observable";

import { Login } from "./domain";
import { SystemService } from "../../core/services";

@Injectable()
export class LoginService {

    private static _loginAPI = "api/:lang/system/authentication/";

    constructor(
        private _systemService: SystemService,
        private _dataService: DataService,
        private _cryptoService: CryptoService) { }

    login(data: Login): Observable<any> {
        return Observable.create(observer => {
            // first, acquiring required info from server
            if (this._systemService.Sid != null) {
                this._doLogin(data, observer);
            } else {
                this._systemService.getClientInfo()
                    .then(() => this._doLogin(data, observer))
                    .catch((error) => observer.error(error));
            }
        });
    }

    private _doLogin(data: Login, observer: any) {
        let sendData = Login.from(data);
        if (sendData) {
            let password = `webLog/${sendData.Userid}/2017/${sendData.Password}`;
            password = this._cryptoService.encrypt(password);
            //sendData.Password = this._cryptoService.md5(password);
            sendData.Password = password;
            sendData.Sid = this._systemService.Sid;
        }
        // if it successfully finished, then calling login
        this._dataService.set(LoginService._loginAPI);
        let loginResult: OperationResult = new OperationResult(false, "");
        this._dataService.post(sendData)
            .subscribe(res => {
                // if login was successful...
                loginResult = OperationResult.fromResponse(res);
                if (loginResult.Succeeded) {
                    observer.next(res);
                }
            },
            error => observer.error(error),
            () => {
                if (loginResult.Succeeded) {
                    // ... then getting menu
                    this._systemService.setLoggedInUser(loginResult.CustomData)
                        .then(() => observer.complete())
                        .catch((error) => observer.error(error));
                } else {
                    // ... otherwise giving back the message
                    observer.error(new Error(loginResult.Message));
                }
            });
    }
}