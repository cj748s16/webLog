import { NgModule, LOCALE_ID, enableProdMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, Headers, RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { Location, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalizeRouterModule, LocalizeParser, ManualParserLoader } from "localize-router";
import { RouterModule } from "@angular/router";
import { FrameworkModule } from "@framework";

import { DataService, NotificationService, UtilityService, LanguageService } from "./core/services";
import { appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";

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

function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "api/system/language/assets/", "");
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        Ng2Bs3ModalModule,
        FrameworkModule,
        AccountModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        LocalizeRouterModule.forRoot(appRoutes),
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [
        DataService,
        NotificationService,
        UtilityService,
        LanguageService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RequestOptions, useClass: AppBaseRequestOptions },
        { provide: LOCALE_ID, deps: [TranslateService], useFactory: (translateService) => translateService.currentLang }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }