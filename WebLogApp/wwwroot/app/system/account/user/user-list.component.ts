import { Component, OnInit, ViewChild, forwardRef } from "@angular/core";
import { UtilityService } from "../../../core/services";

import { Key, compareKey, TAB_ACCESSOR, TabAccessor, TabContentComponent } from "@framework";

import { UserService } from "./user.service";
import { UserViewModel } from "./domain";
import { UserEditComponent } from "./user-edit.component";

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

    private _users: Array<UserViewModel>;
    private _selectedKey: Key;

    @ViewChild(UserEditComponent)
    private _editModal: UserEditComponent;

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
        this._editModal.open().then(() => this.getUsers());
    }

    modify() {
        if (this._selectedKey) {
            this._editModal.open(this._selectedKey).then(() => this.getUsers());
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