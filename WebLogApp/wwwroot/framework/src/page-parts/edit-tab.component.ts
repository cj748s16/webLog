import { OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Params } from "@angular/router";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/switchMap";

import { Key, OperationResult, IService } from "../utility";
import { NotificationService, UtilityService } from "../services";

import { InlineEditComponent } from "./inline-edit.component";
import { Control } from "../controls/control";
import { IEdit } from "./iedit";

export class EditTabComponent<T> implements OnInit {

    @ViewChild(IEdit)
    private _editComponent: IEdit<T>;

    private _modal: ModalComponent;

    protected idField: string = "Id";
    protected key: Key;
    protected entity: T;

    private _donePromise: Promise<any>;
    private _doneResolve: () => void;
    private _doneReject: () => void;

    private _route: ActivatedRoute;
    private _location: Location;

    constructor(
        private _service: IService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService) { }

    ngOnInit() {
        this.entity = <T>{};
        if (this._editComponent) {
            this._editComponent.cancel.subscribe(() => this._close(), error => console.error(`Error: ${error}`));
            this._editComponent.save.subscribe(() => this._save(), error => console.error(`Error: ${error}`));
            this._modal = this._editComponent.modal;
            if (this._editComponent.activatedRoute) {
                this._route = this._editComponent.activatedRoute.route;
                this._location = this._editComponent.activatedRoute.location;
            }
        }
        if (this._route != null) {
            this._route.params
                .subscribe((key: any) => {
                    this.open(key);
                },
                error => console.log(`Error: ${error}`));
        }
    }

    open(key: Key = null): Promise<any> {
        return this._donePromise = new Promise<any>((resolve, reject) => {
            this._doneResolve = resolve;
            this._doneReject = reject;

            this.key = key;
            if (this.key != null) {
                this._loadEntity(this.key).then(this._showModal.bind(this)).catch(() => {
                    this.key = null;
                    this._showModal();
                });
            } else {
                this._showModal();
            }
        });
    }

    private _showModal() {
        if (this._editComponent) {
            this._editComponent.entity = this.entity;
        }
        if (this._modal) {
            this._modal.open();
        }
    }

    private _close(success: boolean = false) {
        if (success) {
            this.afterSaved();
            this._doneResolve();
        }
        if (this._modal) {
            this._modal.close();
        } else if (this._location) {
            this._location.back();
        }
        this.entity = <T>{};
        if (this._editComponent) {
            this._editComponent.entity = this.entity;
        }
    }

    protected afterSaved() {
    }

    private _loadEntity(key: Key): Promise<any> {
        let loadResult: OperationResult = new OperationResult(false, "");
        return new Promise<any>((resolve, reject) => {
            if (key == null) {
                reject();
            }
            const id = this.idField in key ? key[this.idField] : null;
            if (id == null) {
                reject();
            } else {
                this._service.get(id)
                    .subscribe(res => {
                        loadResult = OperationResult.fromResponse(res);
                    },
                    error => this._utilityService.handleError.bind(this._utilityService),
                    () => {
                        if (loadResult.Succeeded) {
                            this.entity = <T>loadResult.CustomData;
                            resolve();
                        } else {
                            this._notificationService.printErrorMessage(loadResult.Message);
                            this._close(false);
                            reject();
                        }
                    });
            }
        });
    }

    private _save() {
        let editResult: OperationResult = new OperationResult(false, "");
        let obs: Observable<any>;

        if (this.key) {
            obs = this._service.modify(this.entity);
        } else {
            obs = this._service.new(this.entity);
        }

        obs
            .subscribe(res => editResult = OperationResult.fromResponse(res),
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