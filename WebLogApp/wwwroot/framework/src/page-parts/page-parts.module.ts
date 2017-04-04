import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { TranslateModule } from "@ngx-translate/core";

import { NotificationService } from "../services";

import { TabsModule } from "../tabs/tabs.module";
import { ActionBarModule } from "../action-bar/action-bar.module";
import { ControlsModule } from "../controls/controls.module";

import { ActivatedRouteComponent } from "./activated-route.component";
import { PageComponent } from "./page.component";
import { TabContentComponent } from "./tab-content.component";
import { AssignTabContentComponent } from "./assign-tab-content.component";

import { EditModalComponent } from "./edit-modal.component";
import { EditContentComponent } from "./edit-content.component";

@NgModule({
    imports: [
        RouterModule,
        Ng2Bs3ModalModule,
        TabsModule,
        ActionBarModule,
        ControlsModule
    ],
    declarations: [
        ActivatedRouteComponent,
        PageComponent,
        TabContentComponent,
        AssignTabContentComponent,
        EditModalComponent,
        EditContentComponent
    ],
    exports: [
        RouterModule,
        Ng2Bs3ModalModule,
        TabsModule,
        ActionBarModule,
        ControlsModule,
        ActivatedRouteComponent,
        PageComponent,
        TabContentComponent,
        AssignTabContentComponent,
        EditModalComponent,
        EditContentComponent
    ],
    providers: [
        NotificationService
    ]
})
export class PagePartsModule { }