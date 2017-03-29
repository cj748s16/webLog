import { NgModule, enableProdMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, Headers, RequestOptions, BaseRequestOptions } from "@angular/http";
import { Location, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { FrameworkModule } from "@framework";

import { DataService, NotificationService, UtilityService } from "./core/services";
import { appRouting } from "./app.routes";
import { AppComponent } from "./app.component";
import { AccountModule } from "./system/account/account.module";

//enableProdMode();

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
        BrowserModule,
        FormsModule,
        HttpModule,
        Ng2Bs3ModalModule,
        FrameworkModule,
        AccountModule,
        appRouting
    ],
    declarations: [AppComponent],
    providers: [
        DataService,
        NotificationService,
        UtilityService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RequestOptions, useClass: AppBaseRequestOptions }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }