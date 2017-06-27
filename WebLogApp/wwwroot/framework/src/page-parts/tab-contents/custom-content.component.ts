import { Component, Input, ViewChild, ContentChildren, QueryList, forwardRef, AfterContentInit, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { Control } from "../../controls";
import { ActivatedRouteComponent } from "../helpers";
import { TabContentComponent } from "./tab-content.component";

declare var jQuery: any;
const $ = jQuery;

@Component({
    selector: "[customTab]",
    template: `
<div activatedRoute></div>
<action-bar></action-bar>
<div class="panel-body" #panel>
    <form class="form col-md-12 center-block" [formGroup]="form">
        <ng-content></ng-content>
    </form>
</div>
`,
    providers: [
        { provide: TabContentComponent, useExisting: forwardRef(() => CustomContentComponent), multi: true }
    ]
})
export class CustomContentComponent extends TabContentComponent implements AfterContentInit, AfterViewInit, OnDestroy {

    @Input()
    public id: string;

    @Input()
    public title: string;

    @ContentChildren(forwardRef(() => Control))
    private _content: QueryList<Control>;

    public controls: Array<Control>;

    @ViewChild(ActivatedRouteComponent)
    activatedRoute: ActivatedRouteComponent;

    private form: FormGroup;

    @ViewChild("panel")
    private _panel: ElementRef;
    private $panel: any;
    private $form: any;

    public afterControlsCollected: Promise<Array<Control>>;
    private afterControlsCollectedResolve: (controls: Array<Control>) => void;

    constructor(private _changeDetector: ChangeDetectorRef, el: ElementRef) {
        super(el);
        this.afterControlsCollected = new Promise<Array<Control>>(resolve => this.afterControlsCollectedResolve = resolve);
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

    ngAfterViewInit() {
        if (this._panel) {
            this.$panel = $(this._panel.nativeElement);
            this.$form = $("form:first-child", this.$panel);
        }
        super.ngAfterViewInit();
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
            if (this.controls) {
                this._assignDataToControls();
            } else {
                this.afterControlsCollected.then(() => this._assignDataToControls());
            }
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

    private get _top(): number {
        return this.$panel ? this.$panel.position().top : 0;
    }

    setHeight() {
        if (this.$panel) {
            this.$el.css({ "height": "100%" });
            this.$panel.css({ "height": `calc(100% - ${this._top}px)` });
            this.$form.css({ "height": "100%" });
        }
        super.setHeight();
    }
}