import { Component, OnInit, ViewChild, forwardRef } from "@angular/core";
import { Key, compareKey, TAB_ACCESSOR, TabAccessor, TabContentComponent, UtilityService } from "@framework";

import { UserService } from "./user.service";
import { UserViewModel } from "./domain";

declare var jQuery: any;
const $ = jQuery;

const noop = () => { };

@Component({
    moduleId: module.id,
    selector: "user-list",
    templateUrl: "user-list.component.html",
    providers: [
        { provide: TAB_ACCESSOR, useExisting: forwardRef(() => UserListComponent), multi: true }
    ]
})
export class UserListComponent implements OnInit, TabAccessor {

    private static _editUrl = "/:lang/account/user/edit/";

    private _users: Array<UserViewModel>;
    private _selectedKey: Key;

    @ViewChild(TabContentComponent)
    private _tabContent: TabContentComponent;

    constructor(
        private _userService: UserService,
        private _utilityService: UtilityService) { }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this._userService.get()
            .subscribe((data: any) => {
                this._users = data;
            },
            error => this._utilityService.handleError.bind(this._utilityService));
    }

    new() {
        this._utilityService.navigate(UserListComponent._editUrl);
    }

    modify() {
        if (this._selectedKey) {
            let id = "Id" in this._selectedKey ? this._selectedKey["Id"] : null;
            this._utilityService.navigate(`${UserListComponent._editUrl}${id}`);
        }
    }

    getTab(): TabContentComponent {
        return this._tabContent;
    }

    writeValue(value: Map<string, Key>) {
        if (value.has("user-list")) {
            this._selectedKey = value.get("user-list");
        }
    }
}