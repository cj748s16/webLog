import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { TranslateModule } from "@ngx-translate/core";

import { NotificationService } from "../notification.service";
import { UtilityService } from "../utility.service";

import { TabsModule } from "../tabs/tabs.module";
import { ActionBarModule } from "../action-bar/action-bar.module";
import { ControlsModule } from "../controls/controls.module";

import { PageComponent } from "./page.component";
import { TabContentComponent } from "./tab-content.component";

import { InlineEditComponent } from "./inline-edit.component";

@NgModule({
    imports: [
        RouterModule,
        Ng2Bs3ModalModule,
        TabsModule,
        ActionBarModule,
        ControlsModule
    ],
    declarations: [
        PageComponent,
        TabContentComponent,
        InlineEditComponent
    ],
    exports: [
        RouterModule,
        Ng2Bs3ModalModule,
        TabsModule,
        ActionBarModule,
        ControlsModule,
        PageComponent,
        TabContentComponent,
        InlineEditComponent
    ],
    providers: [
        NotificationService,
        UtilityService
    ]
})
export class PagePartsModule { }