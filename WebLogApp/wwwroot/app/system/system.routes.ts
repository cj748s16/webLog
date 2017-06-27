import { Routes } from "@angular/router";

import { SystemComponent } from "./system.component";

import { LoginComponent } from "./login";

export const systemRoutes: Routes = [
    {
        path: "",
        component: SystemComponent,
        children: [
            { path: "login", component: LoginComponent },
            { path: "account", loadChildren: "./app/system/account/account.module#AccountModule" }
        ]
    }
];