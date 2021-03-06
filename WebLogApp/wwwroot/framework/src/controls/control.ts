﻿import { Component, Input, Output, ElementRef, SimpleChanges, OnInit, OnChanges, forwardRef, EventEmitter } from "@angular/core";
import { FormControl, AbstractControl, Validators, ControlValueAccessor, Validator, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

import { createId } from "../utility";

declare var jQuery: any;
const $ = jQuery;

const noop = () => { };

@Component({
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Control), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => Control), multi: true }
    ]
})
export abstract class Control implements OnInit, OnChanges, ControlValueAccessor, Validator {

    @Input() name: string;
    @Input() placeholder: string;
    @Input() disabled: boolean;
    @Input() errorDefs: { [key: string]: any };

    @Output() change = new EventEmitter<any>();

    protected $host: any;
    protected $control: any;
    protected $formGroup: any;

    protected _errorMsg: string[];
    protected _validators = new Array<ValidatorFn>();

    control: FormControl = new FormControl();

    uniqueid: string = createId(this.constructor.name);

    constructor(
        protected _element: ElementRef,
        protected _translateService: TranslateService) {
    }

    ngOnInit() {
        this.$host = $(this._element.nativeElement);
        this.$control = $("input:first-child", this.$host);
        this.$formGroup = $(".form-group", this.$host);

        this._parseAttributesAndErrors();

        this.control = new FormControl(this.value, this._validators);
    }

    protected _parseAttributesAndErrors() {
        this._setupErrorDefs();
        this._setupDisabled();
    }

    private _setupErrorDefs() {
        if (this.errorDefs) {
            Object.keys(this.errorDefs).forEach(key => {
                if (key in Validators) {
                    if (typeof this.errorDefs[key] === "string") {
                        this.errorDefs[key] = {
                            message: this.errorDefs[key],
                            fn: Validators[key]
                        };
                    } else if (typeof this.errorDefs[key] === "boolean") {
                        this.errorDefs[key] = {
                            message: "validators.required",
                            fn: Validators[key]
                        };
                    } else if (!this.errorDefs[key]) {
                        this.errorDefs[key].fn = Validators[key];
                    }
                    this._validators.push(Validators[key]);
                } else if (typeof this.errorDefs[key] === "object") {
                    this._validators.push(this.errorDefs[key].fn);
                }
            });
        }
    }

    private _setupDisabled(value?: boolean) {
        if (value != null) {
            this.disabled = value;
        }
        if (typeof this.disabled !== "boolean") {
            if (this.$host.attr("disabled") != null) {
                this.disabled = true;
                if (this.$control) {
                    this.$control.attr("disabled", this.disabled ? this.disabled : null);
                }
            }
        } else if (this.$control) {
            this.$control.attr("disabled", this.disabled ? this.disabled : null);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ("disabled" in changes) {
            this._setupDisabled(!!changes["disabled"].currentValue);
        }
        if ("errorDefs" in changes) {
            this._setupErrorDefs();
        }
    }

    /// ControlValueAccessor
    private _value: string = null;
    private onTouchedCallback: () => void = noop;
    private onChangedCallback: (_: any) => void = noop;

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        this.control.markAsTouched();
        this._setValue(v);
    }

    private _checkFormGroupIsEmpty() {
        if (!this.value) {
            this.$formGroup.addClass("is-empty");
        } else {
            this.$formGroup.removeClass("is-empty");
        }
    }

    private _intrlSetValue(v: any, setToControl: boolean = false): boolean {
        if (this._value != v) {
            this._value = v;
            if (setToControl) {
                this.control.setValue(v, { onlySelf: true, emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false });
            }
            this.validate(this.control);
            this._checkFormGroupIsEmpty();
            return true;
        } else {
            this._checkFormGroupIsEmpty();
            return false;
        }
    }

    protected _setValue(v: any) {
        if (this._intrlSetValue(v, true)) {
            this.onChangedCallback(v);
            this.change.emit(v);
        }
    }

    writeValue(v: any) {
        this._intrlSetValue(v, true);
        this.control.markAsUntouched();
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
    validate(c: AbstractControl): ValidationErrors {
        this._errorMsg = null;
        let result: ValidationErrors = {};
        if (this.errorDefs) {
            Object.keys(this.errorDefs).forEach(key => {
                let err = this.errorDefs[key];
                if (err.fn) {
                    let ret = err.fn(c);
                    if (ret && ret[key]) {
                        result[key] = this._translateService.instant(err.message, { "value": this._translateService.instant(this.placeholder) });
                    }
                }
            });
        }
        this._errorMsg = !c.untouched ? Object.keys(result).map(k => result[k]) : null;
        return result;
    }

    reset() {
        this.control.markAsUntouched;
        this._errorMsg = null;
    }
}