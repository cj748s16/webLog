import { Component, Input, Output, OnInit, ViewChild, EventEmitter, ViewChildren, ContentChildren, QueryList, forwardRef, AfterContentInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { Observable } from "rxjs/Observable";

import { Key, OperationResult, IService } from "../utility";
import { NotificationService } from "../notification.service";
import { UtilityService } from "../utility.service";

import { Control } from "../controls/control";

@Component({
    selector: "inline-edit",
    template: `
<modal id="id" class="modal" tabindex="-1" role="dialog" aria-hidden="true" [backdrop]="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" (click)="_cancel($event)">x</button>
        <h1 class="text-center">{{title | translate}}</h1>
    </div>
    <div class="modal-body" style="overflow: auto;">
        <form class="form col-md-12 center-block" [formGroup]="form">
            <ng-content></ng-content>
            <saveButton (clicked)="_save($event)" [disabled]="!form.valid"></saveButton>
        </form>
    </div>
    <div class="modal-footer">
        <cancelButton (clicked)="_cancel($event)" data-dismiss="modal" aria-hidden="true"></cancelButton>
    </div>
</modal>
`
})
export class InlineEditComponent implements AfterContentInit {

    @Input()
    public id: string;

    @Input()
    public title: string;

    @Output()
    public save = new EventEmitter<Event>();

    @Output()
    public cancel = new EventEmitter<Event>();

    @ViewChild(ModalComponent)
    public _modal: ModalComponent;

    @ContentChildren(forwardRef(() => Control))
    private _content: QueryList<Control>;

    private _controls: Array<Control>;

    private form: FormGroup;

    constructor(private _changeDetection: ChangeDetectorRef) { }

    private _save($event: Event) {
        this.save.emit($event);
    }

    private _cancel($event: Event) {
        this.cancel.emit($event);
    }

    ngAfterContentInit() {
        let group: any = {};

        this._controls = this._content.map(c => c);

        this._controls.forEach(ctrl => {
            ctrl.registerOnChange((v) => {
                if (this.entity) {
                    this.entity[ctrl.name] = v;
                }
            });
            group[ctrl.name] = ctrl.control;
        });

        this.form = new FormGroup(group);
    }

    private _entity: any;

    public get entity(): any {
        return this._entity;
    }

    public set entity(v: any) {
        if (this._entity != v) {
            this._entity = v;
            this._assignDataToControls();
        }
    }

    private _assignDataToControls() {
        this._controls.forEach(ctrl => {
            ctrl.writeValue(this._entity ? this._entity[ctrl.name] : null);
        });
        this._changeDetection.detach();
        this._changeDetection.detectChanges();
    }
}

export class InlineEdit<T> implements OnInit {

    @ViewChild(InlineEditComponent)
    private _inlineEditComponent: InlineEditComponent;

    private _modal: ModalComponent;

    protected idField: string = "Id";
    protected key: Key;
    protected entity: T;

    private _donePromise: Promise<any>;
    private _doneResolve: () => void;
    private _doneReject: () => void;

    constructor(
        private _service: IService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService) { }

    ngOnInit() {
        this.entity = <T>{};
        if (this._inlineEditComponent) {
            this._inlineEditComponent.cancel.subscribe(() => this._close(), error => console.error(`Error: ${error}`));
            this._inlineEditComponent.save.subscribe(() => this._save(), error => console.error(`Error: ${error}`));
            this._modal = this._inlineEditComponent._modal;
        }
    }

    open(key: Key = null): Promise<any> {
        return this._donePromise = new Promise<any>((resolve, reject) => {
            this._doneResolve = resolve;
            this._doneReject = reject;

            this.key = key;
            if (this.key != null) {
                this._loadEntity(this.key).then(this._showModal.bind(this)).catch(() => { });
            } else {
                this._showModal();
            }
        });
    }

    private _showModal() {
        if (this._inlineEditComponent) {
            this._inlineEditComponent.entity = this.entity;
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
        }
        this.entity = <T>{};
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