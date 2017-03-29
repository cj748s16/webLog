import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountComponent } from "./account.component";

import { UserComponent } from "./user/user.component";
import { UserListComponent } from "./user/user-list.component";

const routes: Routes = [
    {
        path: "account",
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

export const accountRouting: ModuleWithProviders = RouterModule.forChild(routes);