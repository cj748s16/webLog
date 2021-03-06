﻿import { Component, Input, Output, ViewChild, EventEmitter, ContentChildren, QueryList, forwardRef, AfterContentInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";

import { Control } from "../controls/control";
import { IEdit } from "./helpers";

@Component({
    selector: "inline-edit",
    //changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
<modal id="{{id}}" class="modal" tabindex="-1" role="dialog" aria-hidden="true" [backdrop]="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" (click)="_cancel($event)">x</button>
        <h1 class="text-center">{{title | translate}}</h1>
    </div>
    <div class="modal-body" style="overflow: auto;">
        <form class="form col-md-12 center-block" [formGroup]="form">
            <div class="inputs">
                <ng-content></ng-content>
            </div>
            <saveButton (clicked)="_save($event)" [disabled]="!form.valid"></saveButton>
        </form>
    </div>
    <div class="modal-footer">
        <cancelButton (clicked)="_cancel($event)" data-dismiss="modal" aria-hidden="true"></cancelButton>
    </div>
</modal>
`,
    providers: [
        { provide: IEdit, useExisting: forwardRef(() => EditModalComponent), multi: true }
    ]
})
export class EditModalComponent implements AfterContentInit, IEdit<any>, OnDestroy {

    @Input()
    public id: string;

    @Input()
    public title: string;

    @Output()
    public save = new EventEmitter<Event>();

    @Output()
    public cancel = new EventEmitter<Event>();

    @ViewChild(ModalComponent)
    public modal: ModalComponent;

    @ContentChildren(forwardRef(() => Control))
    private _content: QueryList<Control>;

    public controls: Array<Control>;

    private form: FormGroup;

    activatedRoute: any;

    public afterControlsCollected: Promise<Array<Control>>;
    private afterControlsCollectedResolve: (controls: Array<Control>) => void;

    constructor(private _changeDetector: ChangeDetectorRef) {
        this.afterControlsCollected = new Promise<Array<Control>>(resolve => this.afterControlsCollectedResolve = resolve);
    }

    private _save($event: Event) {
        this.save.emit($event);
    }

    private _cancel($event: Event) {
        this.cancel.emit($event);
    }

    ngAfterContentInit() {
        let group: any = {};

        this.controls = this._content.map(c => c);

        this.controls.forEach(ctrl => {
            ctrl.registerOnChange((v) => {
                if (this.entity) {
                    this.entity[ctrl.name] = v;
                }
                setTimeout(() => this._detectChanges(), 100);
            });
            group[ctrl.name] = ctrl.control;
        });

        this.form = new FormGroup(group);

        this.afterControlsCollectedResolve(this.controls);
    }

    private _detectChanges() {
        if (this._changeDetector != null) {
            this._changeDetector.detectChanges();
        }
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
        this._changeDetector.detach();
        this.controls.forEach(ctrl => {
            ctrl.writeValue(this._entity ? this._entity[ctrl.name] : null);
        });
        setTimeout(() => this._detectChanges(), 100);
    }

    ngOnDestroy() {
        this._changeDetector = null;
    }
}