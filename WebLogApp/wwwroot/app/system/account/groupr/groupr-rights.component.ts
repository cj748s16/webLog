import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseTabComponent, NotificationService, UtilityService, EventsService, Key, TabContentComponent, DropdownControl, OperationResult } from "@framework";

import { GroupRights, GroupRightsData } from "./domain";
import { GroupRService } from "./groupr.service";
import { GroupViewModel } from "../group/domain";

@Component({
    moduleId: module.id,
    selector: "groupr-rights",
    templateUrl: "groupr-rights.component.html"
})
export class GroupRRightsComponent extends BaseTabComponent<GroupRights> {

    private _groupList: Array<GroupViewModel>;
    private _list: Array<GroupRights>;

    @ViewChild("checkbox")
    private _checkbox: any;

    @ViewChild("groupid")
    private _groupIdCtrl: DropdownControl;

    constructor(
        grouprService: GroupRService,
        utilityService: UtilityService,
        el: ElementRef,
        private _notificationService: NotificationService,
        private _eventsService: EventsService) {
        super(grouprService, utilityService, el);
    }

    ngOnInit() {
        this._getGroupList();
    }

    private _getGroupList() {
        (<GroupRService>this._service).getGroupList()
            .subscribe((data: any) => this._groupList = data,
            error => this._utilityService.handleError(error));
    }

    private _lastGroupid: number = undefined;

    private _groupChanged(groupid: number) {
        if (typeof groupid === "number" && this._lastGroupid !== groupid) {
            // already called with Event, but only need the number
            this._lastGroupid = groupid;
            this._getList(groupid);
        }
    }

    private _getList(groupid: number) {
        let loadResult: OperationResult = new OperationResult(false, "");
        this._service.get(groupid)
            .subscribe(res => loadResult = OperationResult.fromResponse(res),
            error => this._utilityService.handleError(error),
            () => {
                if (loadResult.Succeeded) {
                    this._list = loadResult.CustomData;
                } else {
                    this._list = null;
                    this._notificationService.printErrorMessage(loadResult.Message);
                }
            });
    }

    writeValue(value: Map<string, Key>) {
    }

    private onSave($event: any) {
        let saveResult: OperationResult = new OperationResult(false, "");

        const sendData = new GroupRightsData(this._lastGroupid, this._list);

        this._service.modify(sendData)
            .subscribe(res => saveResult = OperationResult.fromResponse(res),
            error => this._utilityService.handleError(error),
            () => {
                if (saveResult.Succeeded) {
                    this._notificationService.printSuccessMessage(saveResult.Message);
                    this._getList(this._groupIdCtrl.value);
                } else {
                    this._notificationService.printErrorMessage(saveResult.Message);
                }
            });
    }

    private onCancel($event: any) {
        this._getList(this._groupIdCtrl.value);
    }
}