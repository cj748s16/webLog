import { Component, OnInit } from "@angular/core";
import { LocalizeRouterService } from "localize-router";
import { TranslateService } from "@ngx-translate/core";

import { UtilityService, LanguageService } from "./core/services";
import { LanguageViewModel } from "./core/domain";

@Component({
    moduleId: module.id,
    selector: "weblog-app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

    private _languages: Array<LanguageViewModel>;

    constructor(
        private _languageService: LanguageService,
        private _localize: LocalizeRouterService,
        private _utilityService: UtilityService,
        private _translateService: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        _translateService.setDefaultLang("en");
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        //_translateService.use("en");
    }

    ngOnInit() {
        this.getLanguages();
    }

    getLanguages() {
        this._languageService.get()
            .subscribe((data: any) => {
                this._languages = data;
            },
            error => this._utilityService.handleError.bind(this._utilityService));
    }

    setLanguage(langId: string) {
        this._localize.changeLanguage(langId);
    }
}