//import "./importGlobalModules";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { JitModule } from "./jit/jit";
import * as c from "./controls";

import { TabsModule } from "./tabs/tabs.module";
import { ActionBarModule } from "./action-bar/action-bar.module";
import { PagePartsModule } from "./page-parts/page-parts.module";

//export { Control } from "./controls";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        TabsModule,
        ActionBarModule,
        PagePartsModule,
        JitModule.forRoot()
    ],
    declarations: [
        //c.Control,
        c.TextboxControl,
        c.GridControl,
        c.GridColumn
    ],
    exports: [
        TranslateModule,
        //c.Control,
        c.TextboxControl,
        c.GridControl,
        c.GridColumn,
        TabsModule,
        ActionBarModule,
        PagePartsModule
    ]
})
export class FrameworkModule { }

export { Key, compareKey, convertDateTime, isMapStringKey } from "./utility";
export { TabsComponent } from "./tabs";
export { PageComponent, TabContentComponent, TabAccessor, TAB_ACCESSOR } from "./page-parts";