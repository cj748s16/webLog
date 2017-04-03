import { Component, forwardRef, ViewChild } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Key, EditContentComponent, EditTabComponent, TabAccessor, TAB_ACCESSOR, NotificationService, UtilityService } from "@framework";

import { UserEdit } from "./domain";
import { UserService } from "./user.service";

@Component({
    moduleId: module.id,
    selector: "user-edit",
    templateUrl: "user-edit.component.html",
    providers: [
        { provide: TAB_ACCESSOR, useExisting: forwardRef(() => UserEditComponent), multi: true }
    ]
})
export class UserEditComponent extends EditTabComponent<UserEdit> implements TabAccessor {

    @ViewChild(EditContentComponent)
    private _tabContent: EditContentComponent;

    constructor(
        userService: UserService,
        notificationService: NotificationService,
        utilityService: UtilityService) {
        super(userService, notificationService, utilityService);
    }

    isConfirmMatches(c: AbstractControl): ValidationErrors {
        if (this.entity && this.entity.Password != this.entity.ConfirmPassword) {
            return { match: true }
        }
        return null;
    }

    getTab(): EditContentComponent {
        return this._tabContent;
    }

    writeValue(value: Map<string, Key>) {
    }
}