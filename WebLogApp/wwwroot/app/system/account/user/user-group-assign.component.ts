import { Component } from "@angular/core";
import { UserService } from "./user.service";
import { NotificationService, UtilityService, DetailAssignTabComponent } from "@framework";

import { GroupViewModel } from "../group/domain";

@Component({
    moduleId: module.id,
    selector: "user-group-assign",
    templateUrl: "user-group-assign.component.html"
})
export class UserGroupAssignComponent extends DetailAssignTabComponent<GroupViewModel> {

    constructor(
        userService: UserService,
        utilityService: UtilityService,
        notificationService: NotificationService) {
        super(userService, utilityService, notificationService);
    }
}