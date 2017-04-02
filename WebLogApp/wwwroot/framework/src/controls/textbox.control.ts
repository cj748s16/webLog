import { Component, Input, ElementRef, forwardRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { Control } from "./control";

@Component({
    selector: "textbox",
    template: `
<div class="form-group">
    <input type="{{!password ? 'text' : 'password'}}" class="form-control input-lg" autocomplete="off" (blur)="onBlur()" [formControl]="control"
        [(ngModel)]="value" [placeholder]="placeholder | translate" />
    <div *ngFor="let msg of _errorMsg" class="alert alert-danger">{{msg}}</div>
</div>
`,
    providers: [
        { provide: Control, useExisting: forwardRef(() => TextboxControl), multi: true }
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