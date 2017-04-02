import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { InlineEdit, NotificationService } from "@framework";
import { UtilityService } from "../../../core/services";

import { GroupEdit } from "./domain";
import { GroupService } from "./group.service";

@Component({
    moduleId: module.id,
    selector: "groupEditModal",
    templateUrl: "group-edit.component.html"
})
export class GroupEditComponent extends InlineEdit<GroupEdit> {

    constructor(
        _groupService: GroupService,
        _notificationService: NotificationService,
        _utilityService: UtilityService) {
        super(_groupService, _notificationService, _utilityService);
    }
}