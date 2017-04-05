import { NgModule, LOCALE_ID, ModuleWithProviders } from "@angular/core";
import { CommonModule, Location, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { HttpModule, Http } from "@angular/http";
import { TranslateModule, TranslateService, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalizeRouterModule } from "localize-router";

import { SidebarComponent } from "./sidebar.component";
import { SideMenuComponent } from "./side-menu.component";
import { SideMenuItemComponent } from "./side-menu-item.component";

import { MenuService } from "../services";

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
                MenuService,
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
                MenuService,
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