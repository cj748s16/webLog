import { Component, ViewChild, forwardRef } from "@angular/core";
import { UtilityService, NotificationService } from "../../../core/services";
import { UserService } from "./user.service";
import { Key, compareKey, TAB_ACCESSOR, TabAccessor, TabContentComponent, isMapStringKey } from "@framework";

import { GroupViewModel, OperationResult } from "../group/domain";

@Component({
    moduleId: module.id,
    selector: "user-group-assign",
    templateUrl: "user-group-assign.component.html",
    providers: [
        { provide: TAB_ACCESSOR, useExisting: forwardRef(() => UserGroupAssignComponent), multi: true }
    ]
})
export class UserGroupAssignComponent implements TabAccessor {

    private _availableGroups: Array<GroupViewModel>;
    private _availableSelectedKey: Key;

    private _assignedGroups: Array<GroupViewModel>;
    private _assignedSelectedKey: Key;

    @ViewChild(TabContentComponent)
    private _tabContent: TabContentComponent;

    private _userKey: Key;

    constructor(
        private _userService: UserService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService) { }

    private _userKeyChanged(newUserKey: Key) {
        if (!compareKey(this._userKey, newUserKey)) {
            this._userKey = newUserKey;
            this._getAvailableGroups();
            this._getAssignedGroups();
        }
    }

    private _getAvailableGroups() {
        if (this._userKey) {
            this._userService.getAvailableGroups(this._userKey)
                .subscribe((data: any) => {
                    this._availableGroups = data;
                },
                error => this._utilityService.handleError.bind(this._utilityService));
        } else {
            this._availableGroups = [];
        }
    }

    private _getAssignedGroups() {
        if (this._userKey) {
            this._userService.getAssignedGroups(this._userKey)
                .subscribe((data: any) => {
                    this._assignedGroups = data;
                },
                error => this._utilityService.handleError.bind(this._utilityService));
        } else {
            this._assignedGroups = [];
        }
    }

    assign() {
        if (this._userKey && this._availableSelectedKey) {
            let assignResult: OperationResult = new OperationResult(false, "");
            this._userService.assignToGroup(this._userKey, this._availableSelectedKey)
                .subscribe(res => assignResult = OperationResult.fromResponse(res),
                error => this._utilityService.handleError.bind(this._utilityService),
                () => {
                    if (assignResult.Succeeded) {
                        this._getAvailableGroups();
                        this._getAssignedGroups();
                    } else {
                        this._notificationService.printErrorMessage(assignResult.Message);
                    }
                });
        }
    }

    unassign() {
        if (this._userKey && this._assignedSelectedKey) {
            let unassignResult: OperationResult = new OperationResult(false, "");
            this._userService.unassignFromGroup(this._userKey, this._assignedSelectedKey)
                .subscribe(res => unassignResult = OperationResult.fromResponse(res),
                error => this._utilityService.handleError.bind(this._utilityService),
                () => {
                    if (unassignResult.Succeeded) {
                        this._getAvailableGroups();
                        this._getAssignedGroups();
                    } else {
                        this._notificationService.printErrorMessage(unassignResult.Message);
                    }
                });
        }
    }

    getTab(): TabContentComponent {
        return this._tabContent;
    }

    writeValue(value: Map<string, (Key | Map<string, Key>)>) {
        if (value.has("user-list")) {
            this._userKeyChanged(value.get("user-list"));
        }
        if (value.has("user-group-assign")) {
            const list = value.get("user-group-assign");
            if (isMapStringKey(list)) {
                if (list.has("availableList")) {
                    this._availableSelectedKey = list.get("availableList");
                }
                if (list.has("assignedList")) {
                    this._assignedSelectedKey = list.get("assignedList");
                }
            }
        }
    }
}