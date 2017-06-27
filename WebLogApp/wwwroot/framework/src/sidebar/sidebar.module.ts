import { NgModule, LOCALE_ID, ModuleWithProviders } from "@angular/core";
import { CommonModule, Location, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { RouterModule, Routes, Router } from "@angular/router";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalizeRouterModule } from "localize-router";

import { SidebarComponent } from "./sidebar.component";
import { SideMenuComponent } from "./side-menu.component";
import { SideMenuItemComponent } from "./side-menu-item.component";

import { MenuService } from "../services";

function createMenuService() {
    let instance: MenuService = null;

    return (router: Router, translateService: TranslateService) => {
        if (instance == null) {
            instance = new MenuService(router, translateService);
        }
        return instance;
    };
}

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        LocalizeRouterModule,
        TranslateModule,
        RouterModule
    ],
    declarations: [
        SidebarComponent,
        SideMenuComponent,
        SideMenuItemComponent
    ],
    exports: [
        HttpModule,
        LocalizeRouterModule,
        TranslateModule,
        RouterModule,
        SidebarComponent,
        SideMenuComponent,
        SideMenuItemComponent
    ],
})
export class SidebarModule {

    static forRoot(routes: Routes): ModuleWithProviders {
        return {
            ngModule: SidebarModule,
            providers: [
                { provide: MenuService, deps: [Router, TranslateService], useFactory: createMenuService() },
                { provide: LOCALE_ID, deps: [TranslateService], useFactory: (translateService) => translateService.currentLang },
                ...LocalizeRouterModule.forRoot(routes).providers,
                ...RouterModule.forRoot(routes).providers
            ]
        };
    }

    static forChild(routes: Routes): ModuleWithProviders {
        return {
            ngModule: SidebarModule,
            providers: [
                { provide: MenuService, deps: [Router, TranslateService], useFactory: (createMenuService) },
                ...LocalizeRouterModule.forChild(routes).providers,
                ...RouterModule.forChild(routes).providers
            ]
        };
    }
}

/* ** TODO
- fix positioning
- hide after clicking when hidden before
*/