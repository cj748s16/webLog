import { Component, OnInit, ViewChild, forwardRef } from "@angular/core";
import { UtilityService } from "../../../core/services";

import { Key, compareKey, TAB_ACCESSOR, TabAccessor, TabContentComponent } from "@framework";

import { GroupService } from "./group.service";
import { GroupViewModel } from "./domain";
import { GroupEditComponent } from "./group-edit.component";

@Component({
    moduleId: module.id,
    selector: "group-list",
    templateUrl: "group-list.component.html",
    providers: [
        { provide: TAB_ACCESSOR, useExisting: forwardRef(() => GroupListComponent), multi: true }
    ]
})
export class GroupListComponent implements OnInit, TabAccessor {

    private _groups: Array<GroupViewModel>;
    private _selectedKey: Key;

    @ViewChild(GroupEditComponent)
    private _editModal: GroupEditComponent;

    @ViewChild(TabContentComponent)
    private _tabContent: TabContentComponent;

    constructor(
        private _groupService: GroupService,
        private _utilityService: UtilityService) { }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        this._groupService.get()
            .subscribe((data: any) => {
                this._groups = data;
            },
            error => this._utilityService.handleError.bind(this._utilityService));
    }

    new() {
        this._editModal.open().then(() => this.getGroups());
    }

    modify() {
        if (this._selectedKey) {
            this._editModal.open(this._selectedKey).then(() => this.getGroups());
        }
    }

    getTab(): TabContentComponent {
        return this._tabContent;
    }

    writeValue(value: Map<string, Key>) {
        if (value.has("group-list")) {
            this._selectedKey = value.get("group-list");
        }
    }
}