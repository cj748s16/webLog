import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { TextboxControl } from "./textbox.control";
import { DropdownControl, DropdownColumn } from "./dropdown.control";
import { GridControl } from "./grid/grid.control";
import { GridColumn } from "./grid/grid-column";
import { SaveButtonControl } from "./save-button.control";
import { CancelButtonControl } from "./cancel-button.control";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        TextboxControl,
        DropdownControl,
        DropdownColumn,
        GridControl,
        GridColumn,
        SaveButtonControl,
        CancelButtonControl
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        TextboxControl,
        DropdownControl,
        DropdownColumn,
        GridControl,
        GridColumn,
        SaveButtonControl,
        CancelButtonControl,
    ]
})
export class ControlsModule { }