import { NgModule, Injector, Type, ModuleWithProviders } from "@angular/core";
import { HttpModule } from "@angular/http";
import { Routes } from "@angular/router";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalizeRouterModule } from "localize-router";

import { JitModule } from "./jit/jit";

import { PagePartsModule } from "./page-parts";
import { DataService, EventsService } from "./services";
import { DropdownControl } from "./controls";

@NgModule({
    imports: [
        HttpModule,
        LocalizeRouterModule,
        TranslateModule,
        PagePartsModule,
        JitModule.forRoot()
    ],
    declarations: [
    ],
    exports: [
        HttpModule,
        LocalizeRouterModule,
        TranslateModule,
        PagePartsModule,
    ],
})
export class FrameworkModule {

    constructor(private injector: Injector) {
        DropdownControl.registerGlobalListener(this.get(EventsService));
    }

    public get<T>(token: Type<T>): T {
        return this.injector.get(token);
    }

    static forRoot(routes: Routes): ModuleWithProviders {
        return {
            ngModule: FrameworkModule,
            providers: [
                DataService,
                ...PagePartsModule.forRoot(routes).providers
            ]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return {
            ngModule: FrameworkModule,
            providers: [
                DataService,
                ...PagePartsModule.forChild(routes).providers
            ]
        };
    }
}