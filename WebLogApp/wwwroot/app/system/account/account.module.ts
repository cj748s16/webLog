import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LocalizeRouterModule } from "localize-router";
import { FrameworkModule } from "@framework";

import { accountRoutes } from "./account.routes";

import { AccountComponent } from "./account.component";

import { UserComponent, UserListComponent, UserEditComponent, UserGroupAssignComponent, UserService } from "./user";
import { GroupComponent, GroupListComponent, GroupEditComponent, GroupService } from "./group";
import { GroupRComponent, GroupRRightsComponent, GroupRService } from "./groupr";

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
        GroupEditComponent,

        GroupRComponent,
        GroupRRightsComponent
    ],
    providers: [
        UserService,
        GroupService,
        GroupRService
    ]
})
export class AccountModule { }