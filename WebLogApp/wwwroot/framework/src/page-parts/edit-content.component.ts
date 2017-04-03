import { Component, Input, Output, ViewChild, EventEmitter, ContentChildren, QueryList, forwardRef, AfterContentInit, ChangeDetectorRef, ElementRef, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { Control } from "../controls/control";
import { ActivatedRouteComponent } from "./activated-route.component";
import { TabContentComponent } from "./tab-content.component";
import { IEdit } from "./iedit";

@Component({
    selector: "[editTab]",
    template: `
<div activatedRoute></div>
<action-bar>
    <button (click)="_save($event)" class="btn btn-raised btn-primary" [disabled]="!form.valid" actionButton>{{'Save' | translate}}</button>
    <button (click)="_cancel($event)" class="btn btn-default" actionButton>{{'Cancel' | translate}}</button>
</action-bar>
<div class="panel-body">
    <form class="form col-md-12 center-block" [formGroup]="form">
        <ng-content></ng-content>
    </form>
</div>
`,
    providers: [
        { provide: TabContentComponent, useExisting: forwardRef(() => EditContentComponent), multi: true },
        { provide: IEdit, useExisting: forwardRef(() => EditContentComponent), multi: true }
    ]
})
export class EditContentComponent extends TabContentComponent implements IEdit<any>, AfterContentInit, OnDestroy {

    @Input()
    public id: string;

    @Input()
    public title: string;

    @Output()
    public save = new EventEmitter<Event>();

    @Output()
    public cancel = new EventEmitter<Event>();

    @ContentChildren(forwardRef(() => Control))
    private _content: QueryList<Control>;

    private _controls: Array<Control>;

    @ViewChild(ActivatedRouteComponent)
    activatedRoute: ActivatedRouteComponent;

    private form: FormGroup;

    modal: any;

    constructor(private _changeDetector: ChangeDetectorRef, el: ElementRef) {
        super(el);
        this._handleButtons = false;
    }

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
                setTimeout(() => this._detectChanges(), 100);
            });
            group[ctrl.name] = ctrl.control;
        });

        this.form = new FormGroup(group);
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
        this._controls.forEach(ctrl => {
            ctrl.writeValue(this._entity ? this._entity[ctrl.name] : null);
        });
        setTimeout(() => this._detectChanges(), 100);
    }

    ngOnDestroy() {
        this._changeDetector = null;
    }
}