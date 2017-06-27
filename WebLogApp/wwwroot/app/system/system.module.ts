import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LocalizeRouterModule } from "localize-router";
import { FrameworkModule } from "@framework";

import { systemRoutes } from "./system.routes";

import { SystemComponent } from "./system.component";
import { LoginComponent, LoginService } from "./login";

@NgModule({
    imports: [
        FrameworkModule.forChild(systemRoutes)
    ],
    declarations: [
        SystemComponent,

        LoginComponent
    ],
    providers: [
        LoginService
    ]
})
export class SystemModule { }