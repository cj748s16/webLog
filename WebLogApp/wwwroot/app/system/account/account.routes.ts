import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountComponent } from "./account.component";

import { UserComponent } from "./user/user.component";
import { UserListComponent } from "./user/user-list.component";

export const accountRoutes: Routes = [
    {
        path: "account",
        //path: "",
        component: AccountComponent,
        children: [
            {
                path: "user",
                component: UserComponent,
                children: [
                    { path: "", redirectTo: "list", pathMatch: "full" },
                    { path: "list", component: UserListComponent },
                ]
            }
        ]
    }
];

//export const accountRouting: ModuleWithProviders = RouterModule.forChild(routes);