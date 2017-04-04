import { Component, forwardRef, ViewChild } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Key, EditContentComponent, EditTabComponent, TAB_ACCESSOR, NotificationService, UtilityService } from "@framework";

import { UserEdit } from "./domain";
import { UserService } from "./user.service";

@Component({
    moduleId: module.id,
    selector: "user-edit",
    templateUrl: "user-edit.component.html",
})
export class UserEditComponent extends EditTabComponent<UserEdit> {

    constructor(
        userService: UserService,
        utilityService: UtilityService,
        notificationService: NotificationService) {
        super(userService, utilityService, notificationService);
    }

    isConfirmMatches(c: AbstractControl): ValidationErrors {
        if (this.entity && this.entity.Password != this.entity.ConfirmPassword) {
            return { match: true }
        }
        return null;
    }
}