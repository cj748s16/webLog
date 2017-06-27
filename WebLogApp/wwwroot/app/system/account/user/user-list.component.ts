import { Component, ElementRef, OnInit, ViewChild, forwardRef } from "@angular/core";
import { Key, compareKey, UtilityService, ListTabComponent } from "@framework";

import { UserService } from "./user.service";
import { UserViewModel } from "./domain";

declare var jQuery: any;
const $ = jQuery;

const noop = () => { };

@Component({
    moduleId: module.id,
    selector: "user-list",
    templateUrl: "user-list.component.html"
})
export class UserListComponent extends ListTabComponent<UserViewModel> {

    private static _editUrl = "/:lang/system/account/user/edit/";

    constructor(
        userService: UserService,
        utilityService: UtilityService,
        el: ElementRef) {
        super(userService, utilityService, el, UserListComponent._editUrl);
    }
}