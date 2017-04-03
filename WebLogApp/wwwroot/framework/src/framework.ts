import { NgModule } from "@angular/core";
import { HttpModule, Headers, RequestOptions, BaseRequestOptions } from "@angular/http";
import { TranslateModule } from "@ngx-translate/core";
import { LocalizeRouterModule } from "localize-router";

import { JitModule } from "./jit/jit";

import { PagePartsModule } from "./page-parts";
import { DataService } from "./services";

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
export class FrameworkModule { }

export { Key, compareKey, convertDateTime, isMapStringKey, OperationResult, IService } from "./utility";
export { TabsComponent } from "./tabs";
export { PageComponent, TabContentComponent, EditContentComponent, EditTabComponent, TabAccessor, TAB_ACCESSOR } from "./page-parts";
export { NotificationService, UtilityService, DataService } from "./services";