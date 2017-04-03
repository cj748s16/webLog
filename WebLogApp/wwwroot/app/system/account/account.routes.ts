import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountComponent } from "./account.component";

import { UserComponent } from "./user/user.component";
import { UserListComponent } from "./user/user-list.component";
import { UserEditComponent } from "./user/user-edit.component";
import { UserGroupAssignComponent } from "./user/user-group-assign.component";

import { GroupComponent } from "./group/group.component";
import { GroupListComponent } from "./group/group-list.component";

export const accountRoutes: Routes = [
    {
        path: "",
        component: AccountComponent,
        children: [
            {
                path: "user",
                component: UserComponent,
                children: [
                    { path: "", redirectTo: "list", pathMatch: "full" },
                    { path: "list", component: UserListComponent },
                    { path: "edit/:Id", component: UserEditComponent },
                    { path: "edit", component: UserEditComponent },
                    { path: "groups", component: UserGroupAssignComponent }
                ]
            },
            {
                path: "group",
                component: GroupComponent,
                children: [
                    { path: "", redirectTo: "list", pathMatch: "full" },
                    { path: "list", component: GroupListComponent }
                ]
            }
        ]
    }
];

//export const accountRouting: ModuleWithProviders = RouterModule.forChild(routes);