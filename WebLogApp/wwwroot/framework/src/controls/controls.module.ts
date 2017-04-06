﻿import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { TextboxControl } from "./textbox.control";
import { DropdownControl, DropdownColumn } from "./dropdown.control";
import { GridControl, GridColumn } from "./grid";
import { SaveButtonControl } from "./save-button.control";
import { CancelButtonControl } from "./cancel-button.control";
import { ErrorMsgComponent } from "./error-msg.component";

import { EventsService } from "../services";

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
        GridControl,
        GridColumn,
        SaveButtonControl,
        CancelButtonControl,
        ErrorMsgComponent
    ],
    providers: [
        EventsService
    ]
})
export class ControlsModule { }