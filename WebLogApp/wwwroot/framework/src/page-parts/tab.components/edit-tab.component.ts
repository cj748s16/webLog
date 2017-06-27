import { Component, ViewChild, forwardRef, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Params } from "@angular/router";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/switchMap";

import { Key, OperationResult, IService } from "../../utility";
import { NotificationService, UtilityService, EventsService } from "../../services";

import { BaseTabComponent } from "./base-tab.component";
import { EditModalComponent } from "../edit-modal.component";
import { Control } from "../../controls";
import { IEdit } from "../helpers";

export class EditTabComponent<T> extends BaseTabComponent<T> {

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
        service: IService,
        utilityService: UtilityService,
        el: ElementRef,
        protected _notificationService: NotificationService,
        protected _eventsService: EventsService) {
        super(service, utilityService, el);
    }

    ngOnInit() {
        if (this._editComponent) {
            this._editComponent.cancel.subscribe(() => this._close(), error => console.error(`Error: ${error}`));
            this._editComponent.save.subscribe(() => this._save(), error => console.error(`Error: ${error}`));
            this._modal = this._editComponent.modal;
            if (this._editComponent.activatedRoute) {
                this._route = this._editComponent.activatedRoute.route;
                this._location = this._editComponent.activatedRoute.location;
            }
            if (this._modal) {
                this._modal.onDismiss.subscribe(() => this._eventsService.broadcast("closeup-dropdown"));
                this._modal.onClose.subscribe(() => this._eventsService.broadcast("closeup-dropdown"));
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

    private _keyIsValid(key: Key) {
        return key != null && this.idField in key && key[this.idField] != null;
    }

    open(key: Key = null): Promise<any> {
        return this._donePromise = new Promise<any>((resolve, reject) => {
            this._doneResolve = resolve;
            this._doneReject = reject;

            this.key = key;
            if (this._keyIsValid(this.key)) {
                this._loadEntity(this.key).then(this._showModal.bind(this)).catch(() => {
                    this.key = null;
                    this._showModal();
                });
            } else {
                this.entity = <T>{};
                this._showModal();
            }
        });
    }

    private _showModal() {
        if (this._editComponent) {
            this._editComponent.entity = this.entity;
            this._editComponent.afterControlsCollected.then((controls) => {
                controls.forEach(c => c.reset());
            });
        }
        if (this._modal) {
            this._modal.open();
        }
    }

    private _close(success: boolean = false) {
        this._eventsService.broadcast("closeup-dropdown");

        if (success) {
            this.afterSaved();
            this._doneResolve();
        }
        if (this._modal) {
            this._modal.close().then(() => {
                this.entity = <T>{};
                if (this._editComponent) {
                    this._editComponent.entity = this.entity;
                }
            });
        } else if (this._location) {
            this._location.back();
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
                    error => this._utilityService.handleError(error),
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

        if (this._keyIsValid(this.key)) {
            obs = this._service.modify(this.entity);
        } else {
            obs = this._service.new(this.entity);
        }

        obs
            .subscribe(res => editResult = OperationResult.fromResponse(res),
            error => this._utilityService.handleError(error),
            () => {
                if (editResult.Succeeded) {
                    this._notificationService.printSuccessMessage(editResult.Message);
                    this._close(true);
                } else {
                    this._notificationService.printErrorMessage(editResult.Message);
                }
            });
    }

    writeValue(value: Map<string, Key>) {
    }
}