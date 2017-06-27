import { Injectable } from "@angular/core";
import { Routes } from "@angular/router";

import { APP_MENU } from "../../app.menu";

import { DataService, UtilityService, CryptoService, MenuService, OperationResult } from "@framework";

@Injectable()
export class SystemService {

    private static _loginAPI = "api/:lang/system/authentication/";
    private static _loginMenuAPI = "api/:lang/system/authentication/getmenu/";

    constructor(
        private _dataService: DataService,
        private _utilityService: UtilityService,
        private _cryptoService: CryptoService,
        private _menuService: MenuService) { }

    getClientInfo(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._sid = null;
            this._userId = null;

            this._dataService.set(SystemService._loginAPI);
            this._dataService.get()
                .subscribe(res => {
                    this._cryptoService.initialize(res);
                    this._sid = (<any>res).sid;
                    this._userId = (<any>res).userid;
                },
                error => {
                    this._utilityService.handleError(error);
                    reject(error);
                },
                () => {
                    if (this.UserId != null) {
                        this._getMenu()
                            .then(() => resolve())
                            .catch((error) => reject(error));
                    }
                    resolve();
                });
        });
    }

    private _sid: string;
    public get Sid(): string {
        return this._sid;
    }

    private _userId: string;
    public get UserId(): string {
        return this._userId;
    }

    setLoggedInUser(data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._userId = data.userid;
            if (this.UserId != null) {
                this._getMenu().then(resolve).catch(reject);
            } else {
                resolve();
            }
        });
    }

    private _getMenu(): Promise<any> {
        let menuResult: OperationResult = new OperationResult(false, "");
        return new Promise<any>((resolve, reject) => {
            this._dataService.set(SystemService._loginMenuAPI);
            this._dataService.get()
                .subscribe(res => menuResult = OperationResult.fromResponse(res),
                error => {
                    this._utilityService.handleError(error);
                    reject(error);
                },
                () => {
                    if (menuResult.Succeeded) {
                        this._menuService.updateMenuByRoutes(<Routes>menuResult.CustomData);
                        resolve();
                    } else {
                        reject(new Error(menuResult.Message));
                    }
                });
        });
    }

    clearLoggedInUser(): Promise<any> {
        return new Promise<any>(resolve => {
            this._menuService.updateMenuByRoutes(<Routes>APP_MENU);
            if (this._userId != null) {
                this._utilityService.navigate("/:lang/home");
                this._userId = null;
            }

            resolve();
        });
    }

    logout() {
        if (this.UserId != null) {
            this._dataService.set(SystemService._loginAPI);
            let logoutResult: OperationResult = new OperationResult(false, "");
            this._dataService.delete()
                .subscribe(res => {
                    logoutResult = OperationResult.fromResponse(res);
                },
                error => this._utilityService.handleError(error),
                () => {
                    if (logoutResult.Succeeded) {
                        this.clearLoggedInUser();
                    } else if (logoutResult.Message != null) {
                        this._utilityService.handleError(new Error(logoutResult.Message));
                    }
                });
        } else {
            this.clearLoggedInUser();
        }
    }
}