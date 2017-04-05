import { Component, forwardRef, ViewChild, ElementRef } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Key, EditContentComponent, EditTabComponent, TAB_ACCESSOR, NotificationService, UtilityService, EventsService } from "@framework";

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
        el: ElementRef,
        notificationService: NotificationService,
        eventsService: EventsService) {
        super(userService, utilityService, el, notificationService, eventsService);
    }

    isConfirmMatches(c: AbstractControl): ValidationErrors {
        if (this.entity && this.entity.Password != this.entity.ConfirmPassword) {
            return { match: true }
        }
        return null;
    }
}