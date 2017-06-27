import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { TextboxControl } from "./textbox.control";
import { DropdownControl, DropdownColumn } from "./dropdown.control";
import { CheckboxControl } from "./checkbox.control";
import { GridControl, GridColumn } from "./grid";
import { SaveButtonControl } from "./save-button.control";
import { CancelButtonControl } from "./cancel-button.control";
import { ErrorMsgComponent } from "./error-msg.component";

import { EventsService, CryptoService } from "../services";

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
        CheckboxControl,
        GridControl,
        GridColumn,
        SaveButtonControl,
        CancelButtonControl,
        ErrorMsgComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        TextboxControl,
        DropdownControl,
        DropdownColumn,
        CheckboxControl,
        GridControl,
        GridColumn,
        SaveButtonControl,
        CancelButtonControl,
        ErrorMsgComponent
    ],
    providers: [
        EventsService,
        CryptoService
    ]
})
export class ControlsModule { }