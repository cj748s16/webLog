import { Injectable } from "@angular/core";
import { Key, IService, UtilityService, DataService } from "@framework";

import { UserEdit } from "./domain";

declare var jQuery: any;
const $ = jQuery;

@Injectable()
export class UserService implements IService {

    private static _userAPI = "api/:lang/system/account/user/";
    private static _userGroupAPI = "api/:lang/system/account/usergroup/";

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

    private _getId(key: Key) {
        if (key != null && "Id" in key) {
            return key["Id"];
        }
        return null;
    }

    getAvailableGroups(user: Key) {
        const userId = this._getId(user);
        this._dataService.set(`${UserService._userGroupAPI}availablebyuser/${userId}`);
        return this._dataService.get();
    }

    getAssignedGroups(user: Key) {
        const userId = this._getId(user);
        this._dataService.set(`${UserService._userGroupAPI}assignedbyuser/${userId}`);
        return this._dataService.get();
    }

    assignToGroup(user: Key, group: Key) {
        var keys: { [key: string]: any } = {};
        keys["userId"] = this._getId(user);
        keys["groupId"] = this._getId(group);

        this._dataService.set(UserService._userGroupAPI);
        return this._dataService.post(JSON.stringify(keys));
    }

    unassignFromGroup(user: Key, group: Key) {
        var keys: { [key: string]: any } = {};
        keys["userId"] = this._getId(user);
        keys["groupId"] = this._getId(group);

        this._dataService.set(`${UserService._userGroupAPI}?${$.param(keys)}`);
        return this._dataService.delete();
    }
}