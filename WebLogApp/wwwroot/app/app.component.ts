import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer } from "@angular/core";
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
export class AppComponent implements OnInit, AfterViewInit {

    private _languages: Array<LanguageViewModel>;

    @ViewChild("appContainer")
    private _appContainer: ElementRef;
    private $appContainer: any;

    @ViewChild("navbarNav")
    private _navbarNav: ElementRef;

    @ViewChildren("navbarDropdown")
    private _navbarDropdown: QueryList<ElementRef>;

    @ViewChild(SidebarComponent)
    private _sidebar: SidebarComponent;

    private _isMenuCollapsed: boolean = false;

    constructor(
        private _languageService: LanguageService,
        private _localize: LocalizeRouterService,
        private _utilityService: UtilityService,
        private _translateService: TranslateService,
        private _menuService: MenuService,
        private _eventService: EventsService,
        private _renderer: Renderer) {
        // this language will be used as a fallback when a translation isn't found in the current language
        _translateService.setDefaultLang("en");

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        //_translateService.use("en");

        // force the UI to reswitch to that lang, without this, some preparsed view remains in the default language
        let currentLang = _translateService.currentLang;
        _translateService.reloadLang(currentLang);
    }

    ngOnInit() {
        this.getLanguages();
        this._menuService.updateMenuByRoutes(<Routes>APP_MENU);
    }

    ngAfterViewInit() {
        this.$appContainer = $(this._appContainer.nativeElement);
        if (this._navbarNav) {
            this._bindNavToggleListener($(this._navbarNav.nativeElement), "collapse");
        }
        if (this._navbarDropdown != null && this._navbarDropdown.length > 0) {
            this._navbarDropdown.forEach(el => {
                this._bindNavToggleListener($(el.nativeElement), "dropdown");
            });
        }
        this._setAppContainerHeight();

        // sidebar collapse
        this._eventService.subscribe("menu.isCollapsed", (args) => {
            this._isMenuCollapsed = <boolean>args[0];
        });
        setTimeout(() => {
            this._isMenuCollapsed = this._sidebar.isMenuCollapsed;
        });
    }

    private _bindNavToggleListener($el: any, event: string) {
        $el.on(`show.bs.${event}`, this._menuToggleStart.bind(this));
        $el.on(`shown.bs.${event}`, this._menuToggled.bind(this));
        $el.on(`hide.bs.${event}`, this._menuToggleStart.bind(this));
        $el.on(`hidden.bs.${event}`, this._menuToggled.bind(this));
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

    private _setAppContainerHeight(predicated: boolean = false) {
        this.$appContainer.css({ "height": `calc(100% - ${this.$appContainer.position().top + (predicated ? 10 : 0)}px)` });
    }

    private _setHeightTimer;
    private _menuToggleStart() {
        if (this._setHeightTimer) {
            clearInterval(this._setHeightTimer);
        }
        this._setAppContainerHeight(true);
        this._setHeightTimer = setInterval(this._setAppContainerHeight.bind(this, true), 10);
    }

    private _menuToggled() {
        if (this._setHeightTimer) {
            clearInterval(this._setHeightTimer);
            this._setHeightTimer = null;
        }
        this._setAppContainerHeight();
    }

    private _toggleSidebar() {
        this._eventService.broadcast("menu.isCollapsed", !this._isMenuCollapsed);
    }
}