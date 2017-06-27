import { Component, Output, EventEmitter, forwardRef, ChangeDetectorRef, ElementRef } from "@angular/core";

import { IEdit } from "../helpers";
import { TabContentComponent } from "./tab-content.component";
import { CustomContentComponent } from "./custom-content.component";

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
export class EditContentComponent extends CustomContentComponent implements IEdit<any> {

    @Output()
    public save = new EventEmitter<Event>();

    @Output()
    public cancel = new EventEmitter<Event>();

    modal: any;

    constructor(changeDetector: ChangeDetectorRef, el: ElementRef) {
        super(changeDetector, el);
        this._handleButtons = false;
    }

    private _save($event: Event) {
        this.save.emit($event);
    }

    private _cancel($event: Event) {
        this.cancel.emit($event);
    }
}