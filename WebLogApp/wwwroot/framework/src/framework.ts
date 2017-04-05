import { NgModule, Injector, Type } from "@angular/core";
import { HttpModule, Headers, RequestOptions, BaseRequestOptions } from "@angular/http";
import { TranslateModule } from "@ngx-translate/core";
import { LocalizeRouterModule } from "localize-router";

import { JitModule } from "./jit/jit";

import { PagePartsModule } from "./page-parts";
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
        TranslateModule,
        PagePartsModule,
        JitModule.forRoot()
    ],
    declarations: [
    ],
    exports: [
        HttpModule,
        PagePartsModule,
    ],
    providers: [
        DataService,
        { provide: RequestOptions, useClass: AppBaseRequestOptions }
    ]
})
export class FrameworkModule {

    constructor(private injector: Injector) {
        DropdownControl.registerGlobalListener(this.get(EventsService));
    }

    public get<T>(token: Type<T>): T {
        return this.injector.get(token);
    }
}

export { Key, compareKey, convertDateTime, isMapStringKey, OperationResult, IService, IAssignService } from "./utility";
export { TabsComponent } from "./tabs";
export { PageComponent, TabContentComponent, EditContentComponent, ListTabComponent, EditTabComponent, DetailAssignTabComponent, TabAccessor, TAB_ACCESSOR } from "./page-parts";
export { NotificationService, UtilityService, DataService, EventsService } from "./services";