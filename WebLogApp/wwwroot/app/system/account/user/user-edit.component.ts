import { Component } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { InlineEdit, NotificationService } from "@framework";
import { UtilityService } from "../../../core/services";

import { UserEdit } from "./domain";
import { UserService } from "./user.service";

@Component({
    moduleId: module.id,
    selector: "userEditModal",
    templateUrl: "user-edit.component.html"
})
export class UserEditComponent extends InlineEdit<UserEdit> {

    constructor(
        _userService: UserService,
        _notificationService: NotificationService,
        _utilityService: UtilityService) {
        super(_userService, _notificationService, _utilityService);
    }

    isConfirmMatches(c: AbstractControl): ValidationErrors {
        if (this.entity.Password != this.entity.ConfirmPassword) {
            return { match: true }
        }
        return null;
    }

    protected afterSaved() {
        //this._modifySavedUser();
    }

    //private _modifySavedUser() {
    //    var user = <User>JSON.parse(localStorage.getItem("user"));
    //    if (user.Userid == this._user.Userid) {
    //        user.Username = this._user.Username;
    //        user.Password = this._user.Password;
    //        localStorage.setItem("user", JSON.stringify(user));
    //    }
    //}
}