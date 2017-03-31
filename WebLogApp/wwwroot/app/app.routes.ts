﻿import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home.component";

export const appRoutes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent }
    //{ path: "account", loadChildren: "./system/account/account.module#AccountModule" }
];

//export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);