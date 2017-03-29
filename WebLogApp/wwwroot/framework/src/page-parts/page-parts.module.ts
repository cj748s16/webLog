import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TabsModule } from "../tabs/tabs.module";
import { ActionBarModule } from "../action-bar/action-bar.module";

import { PageComponent } from "./page.component";
import { TabContentComponent } from "./tab-content.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TabsModule,
        ActionBarModule
    ],
    declarations: [
        PageComponent,
        TabContentComponent
    ],
    exports: [
        PageComponent,
        TabContentComponent
    ]
})
export class PagePartsModule { }