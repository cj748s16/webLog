import { Injectable } from "@angular/core";
import { IService, UtilityService, DataService } from "@framework";

import { GroupEdit } from "./domain";

@Injectable()
export class GroupService implements IService {

    private static _groupAPI = "api/:lang/system/account/group/";
    private static _roleAPI = "api/:lang/system/account/role/";

    constructor(private _dataService: DataService) { }

    get(id?: number) {
        this._dataService.set(id != null ? `${GroupService._groupAPI}${id}` : GroupService._groupAPI);
        return this._dataService.get();
    }

    new(group: GroupEdit) {
        this._dataService.set(GroupService._groupAPI);
        return this._dataService.post(group);
    }

    modify(group: GroupEdit) {
        this._dataService.set(GroupService._groupAPI);
        return this._dataService.put(group);
    }

    getRoleList() {
        this._dataService.set(GroupService._roleAPI);
        return this._dataService.get();
    }
}