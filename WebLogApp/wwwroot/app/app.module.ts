import { NgModule, LOCALE_ID, enableProdMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { Location, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { Http } from "@angular/http";
import { LocalizeRouterModule } from "localize-router";
import { FrameworkModule, UtilityService as fwUtilityService } from "@framework";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { UtilityService, LanguageService } from "./core/services";
import { appRoutes } from "./app.routes";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home.component";

//enableProdMode();

function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "api/system/language/assets/", "");
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
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }