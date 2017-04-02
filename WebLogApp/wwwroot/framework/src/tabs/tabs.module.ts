import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { TabLinkComponent } from "./tab-link.component";
import { TabComponent } from "./tab.component";
import { TabsComponent } from "./tabs.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    declarations: [
        TabLinkComponent,
        TabComponent,
        TabsComponent
    ],
    exports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        TabComponent,
        TabsComponent
    ]
})
export class TabsModule { }