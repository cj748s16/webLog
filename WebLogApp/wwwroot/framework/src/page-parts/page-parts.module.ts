import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { TranslateModule } from "@ngx-translate/core";

import { NotificationService } from "../services";

import { TabsModule } from "../tabs/tabs.module";
import { ActionBarModule } from "../action-bar/action-bar.module";
import { ControlsModule } from "../controls/controls.module";
import { SidebarModule } from "../sidebar/sidebar.module";

import { ActivatedRouteComponent } from "./helpers";

import { TabContentComponent, AssignTabContentComponent, EditContentComponent } from "./tab-contents";

import { PageMasterComponent } from "./page-master.component";
import { PageComponent } from "./page.component";
import { EditModalComponent } from "./edit-modal.component";
import { TopBarComponent } from "./top-bar.component";

@NgModule({
    imports: [
        RouterModule,
        Ng2Bs3ModalModule,
        TabsModule,
        ActionBarModule,
        ControlsModule,
        SidebarModule
    ],
    declarations: [
        PageMasterComponent,
        TopBarComponent,
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
        SidebarModule,
        PageMasterComponent,
        TopBarComponent,
        ActivatedRouteComponent,
        PageComponent,
        TabContentComponent,
        AssignTabContentComponent,
        EditModalComponent,
        EditContentComponent
    ]
})
export class PagePartsModule {

    static forRoot(routes: Routes): ModuleWithProviders {
        return {
            ngModule: PagePartsModule,
            providers: [
                NotificationService,
                ...SidebarModule.forRoot(routes).providers
            ]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return {
            ngModule: PagePartsModule,
            providers: [
                NotificationService,
                ...SidebarModule.forChild(routes).providers
            ]
        };
    }
}