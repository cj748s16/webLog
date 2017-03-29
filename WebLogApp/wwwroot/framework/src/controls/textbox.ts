import { Component, Input, ElementRef, OnInit, EventEmitter, forwardRef, ViewChild } from "@angular/core";
import {
    FormControl, AbstractControl,
    ControlValueAccessor, NG_VALUE_ACCESSOR,
    Validator, NG_VALIDATORS, Validators
} from "@angular/forms";

import { Control } from "./control";

declare var jQuery: any;
const $ = jQuery;

const noop = () => { };

@Component({
    selector: "textbox",
    template: `
<div class="form-group">
    <input type="{{!password ? 'text' : 'password'}}" class="form-control input-lg" autocomplete="off" [(ngModel)]="value" (blur)="onBlur()" [formControl]="control"
        [placeholder]="placeholder" />
    <div [hidden]="!_errorMsg" class="alert alert-danger">{{_errorMsg}}</div>
</div>
`,
    // id="_control" name="_control" #control="ngModel" [required]="_required" [disabled]="disabled" 
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextboxControl), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => TextboxControl), multi: true }
    ]
})
export class TextboxControl implements OnInit, ControlValueAccessor, Validator {

    @Input() placeholder: string;
    @Input() disabled: boolean;
    @Input() errorDefs: any;
    @Input() password: boolean;
    //private _required: boolean;

    private $host: any;

    //@ViewChild("control")
    private control: FormControl = new FormControl();

    private _errorMsg: string;

    constructor(private _element: ElementRef) {
    }

    ngOnInit() {
        this._init();
    }

    private _init() {
        this.$host = $(this._element.nativeElement);

        this._parseAttributesAndErrors();
    }

    private _parseAttributesAndErrors() {
        if (this.errorDefs) {
            Object.keys(this.errorDefs).forEach(key => {
                if (key in Validators) {
                    if (typeof this.errorDefs[key] === "string") {
                        this.errorDefs[key] = {
                            message: this.errorDefs[key],
                            fn: Validators[key]
                        };
                    } else if (!this.errorDefs[key]) {
                        this.errorDefs[key].fn = Validators[key];
                    }
                }
            });
        }

        if (typeof this.disabled !== "boolean") {
            if (this.$host.attr("disabled") != null) {
                //this.disabled = true;
                this.control.setValue({ value: this._value, disabled: true });
            }
        }

        if (typeof this.password !== "boolean") {
            if (this.$host.attr("password") != null) {
                this.password = true;
            }
        }
    }

    private _statusChanged() {
    }

    /// ControlValueAccessor
    private _value: string = null;
    private onTouchedCallback: () => void = noop;
    private onChangedCallback: (_: any) => void = noop;

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (this._value != v) {
            this._value = v;
            this.onChangedCallback(v);
        }
    }

    writeValue(v: any) {
        if (this._value != v) {
            this._value = v;
        }
    }

    registerOnChange(fn: any) {
        this.onChangedCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    onBlur() {
        this.validate(this.control);
        this.onTouchedCallback();
    }

    /// Validator
    validate(c: AbstractControl): { [key: string]: any } {
        this._errorMsg = "";
        let result = {};
        if (this.errorDefs) {
            Object.keys(this.errorDefs).forEach(key => {
                let err = this.errorDefs[key];
                if (err.fn) {
                    let ret = err.fn(c);
                    if (ret && ret[key]) {
                        result[key] = err.message;
                    }
                }
            });
        }
        this._errorMsg = !c.untouched ? Object.keys(result).map(k => result[k]).join("<br/>") : "";
        return result;
    }
}