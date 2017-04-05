import { NgModule } from "@angular/core";
import { LocalizeRouterModule, LocalizeParser, ManualParserLoader } from "localize-router";
import { RouterModule } from "@angular/router";
import { FrameworkModule } from "@framework";

import { accountRoutes } from "./account.routes";

import { AccountComponent } from "./account.component";

import { UserService } from "./user/user.service";
import { UserComponent } from "./user/user.component";
import { UserListComponent } from "./user/user-list.component";
import { UserEditComponent } from "./user/user-edit.component";
import { UserGroupAssignComponent } from "./user/user-group-assign.component";

import { GroupService } from "./group/group.service";
import { GroupComponent } from "./group/group.component";
import { GroupListComponent } from "./group/group-list.component";
import { GroupEditComponent } from "./group/group-edit.component";

@NgModule({
    imports: [
        FrameworkModule.forChild(accountRoutes)
    ],
    declarations: [
        AccountComponent,

        UserComponent,
        UserListComponent,
        UserEditComponent,
        UserGroupAssignComponent,

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