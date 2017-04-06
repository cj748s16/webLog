import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Routes } from "@angular/router";
import { LocalizeRouterService } from "localize-router";
import { TranslateService } from "@ngx-translate/core";
import { MenuService, EventsService, SidebarComponent } from "@framework";

import { UtilityService, LanguageService } from "./core/services";
import { LanguageViewModel } from "./core/domain";

import { APP_MENU } from "./app.menu";

declare var jQuery: any;
const $ = jQuery;

@Component({
    moduleId: module.id,
    selector: "weblog-app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

    private _languages: Array<LanguageViewModel>;

    private _isMenuCollapsed: boolean = false;

    constructor(
        private _languageService: LanguageService,
        private _localize: LocalizeRouterService,
        private _utilityService: UtilityService,
        private _translateService: TranslateService,
        private _menuService: MenuService,
        private _eventService: EventsService,
        private _changeDetector: ChangeDetectorRef) {
        // this language will be used as a fallback when a translation isn't found in the current language
        _translateService.setDefaultLang("en");

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        //_translateService.use("en");

        // force the UI to reswitch to that lang, without this, some preparsed view remains in the default language
        let currentLang = _translateService.currentLang;
        _translateService.reloadLang(currentLang);

        // sidebar collapse
        this._eventService.subscribe("menu.isCollapsed", (args) => {
            let newValue = args;
            if (newValue != this._isMenuCollapsed) {
                this._isMenuCollapsed = newValue;
                this._changeDetector.detectChanges();
            }
        });
    }

    ngOnInit() {
        this.getLanguages();
        this._menuService.updateMenuByRoutes(<Routes>APP_MENU);
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