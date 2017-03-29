import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TabLinkComponent } from "./tab-link.component";
import { TabComponent } from "./tab.component";
import { TabsComponent } from "./tabs.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        TabLinkComponent,
        TabComponent,
        TabsComponent
    ],
    exports: [
        TabComponent,
        TabsComponent
    ]
})
export class TabsModule { }