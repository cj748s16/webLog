import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalizeRouterModule, LocalizeParser, ManualParserLoader } from "localize-router";
import { RouterModule } from "@angular/router";
import { FrameworkModule } from "@framework";

import { accountRoutes } from "./account.routes";

import { AccountComponent } from "./account.component";

import { UserService } from "./user/user.service";
import { UserComponent } from "./user/user.component";
import { UserListComponent } from "./user/user-list.component";
import { UserEditComponent } from "./user/user-edit.component";

import { GroupService } from "./group/group.service";
import { GroupComponent } from "./group/group.component";
import { GroupListComponent } from "./group/group-list.component";
import { GroupEditComponent } from "./group/group-edit.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        Ng2Bs3ModalModule,
        FrameworkModule,
        TranslateModule,
        LocalizeRouterModule.forChild(accountRoutes),
        RouterModule.forChild(accountRoutes)
    ],
    declarations: [
        AccountComponent,

        UserComponent,
        UserListComponent,
        UserEditComponent,

        GroupComponent,
        GroupListComponent,
        GroupEditComponent
    ],
    providers: [
        UserService,
        GroupService
    ]
})
export class AccountModule { }