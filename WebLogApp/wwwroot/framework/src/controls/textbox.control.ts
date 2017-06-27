import { Component, Input, ElementRef, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

import { Control } from "./control";

@Component({
    selector: "textbox",
    template: `
<div class="form-group form-group-lg label-floating" [class.has-error]="_errorMsg && _errorMsg.length">
    <label for="{{uniqueid}}" class="control-label">{{placeholder | translate}}</label>
    <input id="{{uniqueid}}" name="{{uniqueid}}" type="{{!password ? 'text' : 'password'}}" class="form-control" autocomplete="off" (blur)="onBlur()" [formControl]="control" [(ngModel)]="value" />
    <error-msg [messages]="_errorMsg"></error-msg>
</div>
`,
    providers: [
        { provide: Control, useExisting: forwardRef(() => TextboxControl), multi: true },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextboxControl), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => TextboxControl), multi: true }
    ]
})
export class TextboxControl extends Control {

    @Input() password: boolean;

    protected _parseAttributesAndErrors() {
        super._parseAttributesAndErrors();
        this._setupPassword();
    }

    private _setupPassword() {
        if (typeof this.password !== "boolean") {
            if (this.$host.attr("password") != null) {
                this.password = true;
            }
        }
    }
}