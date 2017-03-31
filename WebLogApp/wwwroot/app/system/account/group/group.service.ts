import { Injectable } from "@angular/core";

import { DataService } from "../../../core/services";
import { GroupEdit } from "./domain";

@Injectable()
export class GroupService {

    private static _groupAPI = "api/:lang/system/account/group/";

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
}