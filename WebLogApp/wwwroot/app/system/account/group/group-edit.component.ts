import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { EditTabComponent, NotificationService, UtilityService } from "@framework";

import { GroupEdit } from "./domain";
import { GroupService } from "./group.service";

@Component({
    moduleId: module.id,
    selector: "groupEditModal",
    templateUrl: "group-edit.component.html"
})
export class GroupEditComponent extends EditTabComponent<GroupEdit> {

    constructor(
        groupService: GroupService,
        utilityService: UtilityService,
        notificationService: NotificationService) {
        super(groupService, utilityService, notificationService);
    }
}