import { Routes } from "@angular/router";

import { AccountComponent } from "./account.component";

import { UserComponent, UserListComponent, UserEditComponent, UserGroupAssignComponent } from "./user";
import { GroupComponent, GroupListComponent } from "./group";
import { GroupRComponent, GroupRRightsComponent } from "./groupr";

export const accountRoutes: Routes = [
    {
        path: "",
        component: AccountComponent,
        children: [{
            path: "user",
            component: UserComponent,
            children: [
                { path: "", redirectTo: "list", pathMatch: "full" },
                { path: "list", component: UserListComponent },
                { path: "edit/:Id", component: UserEditComponent },
                { path: "edit", component: UserEditComponent },
                { path: "groups", component: UserGroupAssignComponent }
            ]
        }, {
            path: "group",
            component: GroupComponent,
            children: [
                { path: "", redirectTo: "list", pathMatch: "full" },
                { path: "list", component: GroupListComponent },
                { path: "rights", component: GroupRComponent }
            ]
        }, {
            path: "groupr",
            component: GroupRComponent,
            children: [
                { path: "", redirectTo: "rights", pathMatch: "full" },
                { path: "rights", component: GroupRRightsComponent }
            ]
        }]
    }
];
