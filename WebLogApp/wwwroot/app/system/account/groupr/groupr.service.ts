import { Injectable } from "@angular/core";
import { IService, UtilityService, DataService } from "@framework";
import { Observable } from "rxjs/Observable";

import { GroupRights, GroupRightsData } from "./domain";

@Injectable()
export class GroupRService implements IService {

    private static _groupRApi = "api/:lang/system/account/grouprights/";

    constructor(private _dataService: DataService) { }

    get(groupid?: number): Observable<any> {
        if (groupid != null) {
            this._dataService.set(`${GroupRService._groupRApi}${groupid}`);
            return this._dataService.get();
        } else {
            return new Observable<any>(observer => {
                setTimeout(() => {
                    observer.complete();
                }, 100);
            });
        }
    }

    modify(sendData: GroupRightsData): Observable<any> {
        this._dataService.set(GroupRService._groupRApi);
        return this._dataService.post(sendData);
    }

    new(entity: any): Observable<any> {
        throw new Error('Method not implemented.');
    }

    getGroupList(): Observable<any> {
        this._dataService.set(`${GroupRService._groupRApi}groups`);
        return this._dataService.get();
    }
}