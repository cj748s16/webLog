import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from "@angular/forms";

import { Control } from "./control";

@Component({
    selector: "checkbox",
    template: `
<div class="form-group">
    <div class="checkbox">
        <label>
            <input id="{{uniqueid}}" name="{{uniqueid}}" type="checkbox" autocomplete="off" [formControl]="control" [(ngModel)]="value">
            <span class="checkbox-material">
                <span class="check"></span>
            </span>
            {{placeholder | translate}}
        </label>
    </div>
</div>
`,
    providers: [
        { provide: Control, useExisting: forwardRef(() => CheckboxControl), multi: true },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxControl), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => CheckboxControl), multi: true }
    ]
})
export class CheckboxControl extends Control {
}