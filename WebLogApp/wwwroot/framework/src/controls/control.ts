import { Component, Input, ElementRef, SimpleChanges, OnInit, OnChanges, forwardRef } from "@angular/core";
import { FormControl, AbstractControl, Validators, ControlValueAccessor, Validator, ValidationErrors, ValidatorFn, NG_VALUE_ACCESSOR, NG_VALIDATORS } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

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

    protected $host: any;
    protected $control: any;

    protected _errorMsg: string[];
    protected _validators = new Array<ValidatorFn>();

    control: FormControl = new FormControl();

    constructor(
        protected _element: ElementRef,
        protected _translateService: TranslateService) {
    }

    ngOnInit() {
        this.$host = $(this._element.nativeElement);
        this.$control = $("input", this.$host);

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
}