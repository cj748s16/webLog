import { Injectable } from "@angular/core";
import { Key, IAssignService, UtilityService, DataService, CryptoService } from "@framework";

import { UserEdit } from "./domain";

declare var jQuery: any;
const $ = jQuery;

@Injectable()
export class UserService implements IAssignService {

    private static _userAPI = "api/:lang/system/account/user/";
    private static _userGroupAPI = "api/:lang/system/account/usergroup/";

    constructor(
        private _dataService: DataService,
        private _cryptoService: CryptoService) { }

    get(id?: number) {
        this._dataService.set(id != null ? `${UserService._userAPI}${id}` : UserService._userAPI);
        return this._dataService.get();
    }

    private _prepareUserData(user: UserEdit): UserEdit {
        const sendUser = UserEdit.from(user);
        sendUser.Password = this._cryptoService.encrypt(sendUser.Password);
        sendUser.ConfirmPassword = this._cryptoService.encrypt(sendUser.ConfirmPassword);
        return sendUser;
    }
    
    new(user: UserEdit) {
        const sendUser = this._prepareUserData(user);
        this._dataService.set(UserService._userAPI);
        return this._dataService.post(sendUser);
    }

    modify(user: UserEdit) {
        const sendUser = this._prepareUserData(user);
        this._dataService.set(UserService._userAPI);
        return this._dataService.put(sendUser);
    }

    private _getId(key: Key) {
        if (key != null && "Id" in key) {
            return key["Id"];
        }
        return null;
    }

    getAvailable(user: Key) {
        const userId = this._getId(user);
        this._dataService.set(`${UserService._userGroupAPI}availablebyuser/${userId}`);
        return this._dataService.get();
    }

    getAssigned(user: Key) {
        const userId = this._getId(user);
        this._dataService.set(`${UserService._userGroupAPI}assignedbyuser/${userId}`);
        return this._dataService.get();
    }

    assign(user: Key, group: Key) {
        var keys: { [key: string]: any } = {};
        keys["userId"] = this._getId(user);
        keys["groupId"] = this._getId(group);

        this._dataService.set(UserService._userGroupAPI);
        return this._dataService.post(keys);
    }

    unassign(user: Key, group: Key) {
        var keys: { [key: string]: any } = {};
        keys["userId"] = this._getId(user);
        keys["groupId"] = this._getId(group);

        this._dataService.set(`${UserService._userGroupAPI}?${$.param(keys)}`);
        return this._dataService.delete();
    }
}