import { NgModule, Injector, Type, ModuleWithProviders } from "@angular/core";
import { HttpModule, Http, Headers, RequestOptions, BaseRequestOptions } from "@angular/http";
import { Routes } from "@angular/router";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalizeRouterModule } from "localize-router";

import { JitModule } from "./jit/jit";

import { PagePartsModule } from "./page-parts";
import { SidebarModule } from "./sidebar";
import { DataService, EventsService } from "./services";
import { DropdownControl } from "./controls";

class AppBaseRequestOptions extends BaseRequestOptions {

    headers: Headers = new Headers();

    constructor() {
        super();
        this.headers.append("Content-Type", "application/json");
        this.body = "";
    }
}

@NgModule({
    imports: [
        HttpModule,
        PagePartsModule,
        LocalizeRouterModule,
        TranslateModule,
        SidebarModule,
        JitModule.forRoot()
    ],
    declarations: [
    ],
    exports: [
        HttpModule,
        LocalizeRouterModule,
        TranslateModule,
        PagePartsModule,
        SidebarModule
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
                { provide: RequestOptions, useClass: AppBaseRequestOptions },
                ...SidebarModule.forRoot(routes).providers
            ]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return {
            ngModule: FrameworkModule,
            providers: [
                DataService,
                { provide: RequestOptions, useClass: AppBaseRequestOptions },
                ...SidebarModule.forChild(routes).providers
            ]
        };
    }
}

export { Key, compareKey, convertDateTime, isMapStringKey, OperationResult, IService, IAssignService } from "./utility";
export { TabsComponent } from "./tabs";
export { PageComponent, TabContentComponent, EditContentComponent, ListTabComponent, EditTabComponent, DetailAssignTabComponent, TabAccessor, TAB_ACCESSOR } from "./page-parts";
export { NotificationService, UtilityService, DataService, EventsService, MenuService, MenuItem } from "./services";
export { SidebarComponent } from "./sidebar";