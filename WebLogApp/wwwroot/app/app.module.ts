import { NgModule, LOCALE_ID, enableProdMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Location, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { Http, Headers, RequestOptions, BaseRequestOptions } from "@angular/http";
import { LocalizeRouterModule } from "localize-router";
import { FrameworkModule, UtilityService as fwUtilityService, DataService, CryptoService, MenuService } from "@framework";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { UtilityService, LanguageService, SystemService } from "./core/services";
import { appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";

//enableProdMode();

function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "api/system/language/assets/", "");
}

function createSystemService() {
    let instance: SystemService = null;

    return (dataService: DataService, utilityService: UtilityService, cryptoService: CryptoService, menuService: MenuService) => {
        if (instance == null) {
            instance = new SystemService(dataService, utilityService, cryptoService, menuService);
        }

        return instance;
    };
}

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
        FrameworkModule.forRoot(appRoutes),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        })
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [
        { provide: fwUtilityService, useClass: UtilityService },
        UtilityService,
        LanguageService,
        { provide: SystemService, deps: [DataService, UtilityService, CryptoService, MenuService], useFactory: createSystemService() },
        { provide: RequestOptions, useClass: AppBaseRequestOptions },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }