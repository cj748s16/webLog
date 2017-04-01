import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { Key } from "@framework";

import { UserEdit, OperationResult } from "./domain";
import { NotificationService } from "../../../core/services";

import { UserService } from "./user.service";

import "rxjs/add/operator/toPromise";

@Component({
    moduleId: module.id,
    selector: "userEditModal",
    templateUrl: "user-edit.component.html"
})
export class UserEditComponent implements OnInit {

    private _id: number;
    private _user: UserEdit;

    private _donePromise: Promise<any>;
    private _doneResolve: () => void;
    private _doneReject: () => void;

    @ViewChild(ModalComponent)
    private _modal: ModalComponent;

    constructor(
        private _userService: UserService,
        private _notificationService: NotificationService) { }

    ngOnInit() {
        this._user = new UserEdit("", "");
    }

    open(key: Key = null): Promise<any> {
        this._donePromise = new Promise<any>((resolve, reject) => {
            this._doneResolve = resolve;
            this._doneReject = reject;
        });

        this._id = key && "Id" in key ? (<any>key).Id : null;
        if (this._id != null) {
            this.loadUser(this._id).then(this._showModal.bind(this));
        } else {
            this._showModal();
        }
        return this._donePromise;
    }

    private _showModal() {
        this._modal.open();
    }

    private _close(success: boolean = false) {
        if (success) {
            this._doneResolve();
        }
        this._modal.close();
        this._user = new UserEdit("", "");
    }

    loadUser(id: number): Promise<any> {
        let loadResult: OperationResult = new OperationResult(false, "");
        const promise = new Promise<any>((resolve, reject) => {
            this._userService.get(id)
                .subscribe(res => loadResult = OperationResult.fromResponse(res),
                error => console.error(`Error: ${error}`),
                () => {
                    if (loadResult.Succeeded) {
                        this._user = <UserEdit>loadResult.CustomData;
                        resolve();
                    } else {
                        this._notificationService.printErrorMessage(loadResult.Message);
                        this._close(false);
                        reject();
                    }
                })
        });
        return promise;
    }

    isConfirmMatches(c: AbstractControl): { [key: string]: boolean } {
        if (this._user.Password != this._user.ConfirmPassword) {
            return { match: true }
        }
        return null;
    }

    save() {
        let editResult: OperationResult = new OperationResult(false, "");
        let obs: Observable<any>;

        if (this._id) {
            obs = this._userService.modify(this._user);
        } else {
            obs = this._userService.new(this._user);
        }

        obs
            .subscribe(res => editResult = OperationResult.fromResponse(res),
            error => console.error(`Error: ${error}`),
            () => {
                if (editResult.Succeeded) {
                    //this._modifySavedUser();
                    this._notificationService.printSuccessMessage(editResult.Message);
                    this._close(true);
                } else {
                    this._notificationService.printErrorMessage(editResult.Message);
                }
            });
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