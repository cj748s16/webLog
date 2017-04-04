import { Component, ElementRef, OnInit, ViewChild, forwardRef } from "@angular/core";
import { Key, compareKey, UtilityService, ListTabComponent } from "@framework";

import { GroupService } from "./group.service";
import { GroupViewModel } from "./domain";
import { GroupEditComponent } from "./group-edit.component";

@Component({
    moduleId: module.id,
    selector: "group-list",
    templateUrl: "group-list.component.html"
})
export class GroupListComponent extends ListTabComponent<GroupViewModel> {

    @ViewChild(GroupEditComponent)
    private _editModal: GroupEditComponent;

    constructor(
        groupService: GroupService,
        utilityService: UtilityService,
        el: ElementRef) {
        super(groupService, utilityService, null, el);
    }


    new() {
        this._editModal.open().then(() => this.getList());
    }

    modify() {
        if (this.selectedKey) {
            this._editModal.open(this.selectedKey).then(() => this.getList());
        }
    }
}