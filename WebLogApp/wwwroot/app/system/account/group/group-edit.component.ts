import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { Key } from "@framework";

import { GroupEdit, OperationResult } from "./domain";
import { NotificationService, UtilityService } from "../../../core/services";

import { GroupService } from "./group.service";

import "rxjs/add/operator/toPromise";

@Component({
    moduleId: module.id,
    selector: "groupEditModal",
    templateUrl: "group-edit.component.html"
})
export class GroupEditComponent implements OnInit {

    private _id: number;
    private _group: GroupEdit;

    private _donePromise: Promise<any>;
    private _doneResolve: () => void;
    private _doneReject: () => void;

    @ViewChild(ModalComponent)
    private _modal: ModalComponent;

    constructor(
        private _groupService: GroupService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService) { }

    ngOnInit() {
        this._group = new GroupEdit("");
    }

    open(key: Key = null): Promise<any> {
        this._donePromise = new Promise<any>((resolve, reject) => {
            this._doneResolve = resolve;
            this._doneReject = reject;
        });

        this._id = key && "Id" in key ? (<any>key).Id : null;
        if (this._id != null) {
            this.loadGroup(this._id).then(this._showModal.bind(this));
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
        this._group = new GroupEdit("");
    }

    loadGroup(id: number): Promise<any> {
        const loadResult: OperationResult = new OperationResult(false, "");
        const promise = new Promise<any>((resolve, reject) => {
            this._groupService.get(id)
                .subscribe((res: any) => {
                    loadResult.Succeeded = res.Succeeded;
                    loadResult.Message = res.Message;
                    loadResult.CustomData = res.CustomData;
                },
                error => this._utilityService.handleError.bind(this._utilityService),
                () => {
                    if (loadResult.Succeeded) {
                        this._group = <GroupEdit>loadResult.CustomData;
                        resolve();
                    } else {
                        this._notificationService.printErrorMessage(loadResult.Message);
                        this._close(false);
                        reject();
                    }
                });
        });
        return promise;
    }

    save() {
        const editResult: OperationResult = new OperationResult(false, "");
        let obs: Observable<any>;

        if (this._id) {
            obs = this._groupService.modify(this._group);
        } else {
            obs = this._groupService.new(this._group);
        }

        obs
            .subscribe(res => {
                editResult.Succeeded = res.Succeeded;
                editResult.Message = res.Message;
                editResult.CustomData = res.CustomData;
            },
            error => this._utilityService.handleError.bind(this._utilityService),
            () => {
                if (editResult.Succeeded) {
                    this._notificationService.printSuccessMessage(editResult.Message);
                    this._close(true);
                } else {
                    this._notificationService.printErrorMessage(editResult.Message);
                }
            });
    }
}