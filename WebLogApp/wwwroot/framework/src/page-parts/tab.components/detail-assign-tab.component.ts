import { AfterViewInit, ElementRef } from "@angular/core";

import { BaseTabComponent } from "./base-tab.component";
import { Key, compareKey, isMapStringKey, IAssignService, OperationResult } from "../../utility";
import { UtilityService, NotificationService } from "../../services";
import { AssignTabContentComponent } from "../tab-contents";

export class DetailAssignTabComponent<T> extends BaseTabComponent<T> implements AfterViewInit {

    protected availableId: string;
    protected availableList: Array<T>;
    protected availableSelectedKey: Key;

    protected assignedId: string;
    protected assignedList: Array<T>;
    protected assignedSelectedKey: Key;

    protected parentId: string;
    protected parentKey: Key;

    public id: string;

    constructor(
        protected _assignService: IAssignService,
        utilityService: UtilityService,
        el: ElementRef,
        protected _notificationService: NotificationService) {
        super(_assignService, utilityService, el);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        var tab = this.getTab();
        if (tab == null) {
            throw new Error(`The AssignTabContent is not found... (getTab -> TabAccessor)`);
        }
        if (!this.id) {
            this.id = tab.id;
        }
        if (!this.parentId) {
            this.parentId = tab.parentId;
        }
        if (!this.availableId) {
            this.availableId = tab.availableId;
        }
        if (!this.assignedId) {
            this.assignedId = tab.assignedId;
        }
    }

    protected parentKeyChanged(newParentKey: Key) {
        if (!compareKey(this.parentKey, newParentKey)) {
            this.parentKey = newParentKey;
            this.getAvailableList();
            this.getAssignedList();
        }
    }

    protected getAvailableList() {
        if (this.parentKey) {
            this._assignService.getAvailable<T>(this.parentKey)
                .subscribe((data: any) => {
                    this.availableList = data;
                },
                error => this._utilityService.handleError.bind(this._utilityService));
        } else {
            this.availableList = [];
        }
    }

    protected getAssignedList() {
        if (this.parentKey) {
            this._assignService.getAssigned<T>(this.parentKey)
                .subscribe((data: any) => {
                    this.assignedList = data;
                },
                error => this._utilityService.handleError.bind(this._utilityService));
        } else {
            this.assignedList = [];
        }
    }

    assign() {
        if (this.parentKey && this.availableSelectedKey) {
            let assignResult: OperationResult = new OperationResult(false, "");
            this._assignService.assign<T>(this.parentKey, this.availableSelectedKey)
                .subscribe(res => assignResult = OperationResult.fromResponse(res),
                error => this._utilityService.handleError.bind(this._utilityService),
                () => {
                    if (assignResult.Succeeded) {
                        this.getAvailableList();
                        this.getAssignedList();
                    } else {
                        this._notificationService.printErrorMessage(assignResult.Message);
                    }
                });
        }
    }

    unassign() {
        if (this.parentKey && this.assignedSelectedKey) {
            let unassignResult: OperationResult = new OperationResult(false, "");
            this._assignService.unassign<T>(this.parentKey, this.assignedSelectedKey)
                .subscribe(res => unassignResult = OperationResult.fromResponse(res),
                error => this._utilityService.handleError.bind(this._utilityService),
                () => {
                    if (unassignResult.Succeeded) {
                        this.getAvailableList();
                        this.getAssignedList();
                    } else {
                        this._notificationService.printErrorMessage(unassignResult.Message);
                    }
                });
        }
    }

    getTab(): AssignTabContentComponent {
        return <AssignTabContentComponent>super.getTab();
    }

    writeValue(value: Map<string, Key>) {
        if (value.has(this.parentId)) {
            this.parentKeyChanged(value.get(this.parentId));
        }
        if (value.has(this.id)) {
            const list = value.get(this.id);
            if (isMapStringKey(list)) {
                if (list.has(this.availableId)) {
                    this.availableSelectedKey = list.get(this.availableId);
                }
                if (list.has(this.assignedId)) {
                    this.assignedSelectedKey = list.get(this.assignedId);
                }
            }
        }
    }
}