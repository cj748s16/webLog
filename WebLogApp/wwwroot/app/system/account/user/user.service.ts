﻿import { Injectable } from "@angular/core";

import { DataService } from "../../../core/services";
import { UserEdit } from "./domain";

import { Key } from "@framework";

declare var jQuery: any;

@Injectable()
export class UserService {

    private static _userAPI = "api/system/account/user/";

    constructor(private _dataService: DataService) { }

    get(id?: number) {
        this._dataService.set(id != null ? `${UserService._userAPI}${id}` : UserService._userAPI);
        return this._dataService.get();
    }

    new(user: UserEdit) {
        this._dataService.set(UserService._userAPI);
        return this._dataService.post(user);
    }

    modify(user: UserEdit) {
        user.ConfirmPassword = null;
        this._dataService.set(UserService._userAPI);
        return this._dataService.put(user);
    }
}