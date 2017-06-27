import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { NotificationService } from "./notification.service";

@Injectable()
export abstract class UtilityService {

    constructor(
        private _router: Router,
        private _notificationService: NotificationService,
        private _translateService: TranslateService,
        protected signInUrl: string) {
    }

    get currentLangId(): string {
        return this._translateService.currentLang;
    }

    prepareUrl(langUrl: string): string {
        const langId = this.currentLangId;
        if (langId) {
            langUrl = langUrl.replace(/:lang/, langId);
        }
        return langUrl;
    }

    navigate(path: string, extras?: NavigationExtras) {
        path = this.prepareUrl(path);
        this._router.navigate([path], extras);
    }

    navigateToSignIn(extras?: NavigationExtras) {
        this.navigate(this.signInUrl, extras);
    }

    handleError(error: any) {
        if (error.status == 401 || error.status == 404) {
            this._notificationService.printErrorMessage(this._translateService.instant("Authentication required"));
            this.navigateToSignIn();
        } else if (error.status == 403) {
            this._notificationService.printErrorMessage(this._translateService.instant("You don't have rights to access this page"));
            // TODO: navigate back
            //this.navigateToSignIn();
        } else {
            console.error(`Error: ${error}`);
            this._notificationService.printErrorMessage(error.message || error.statusText);
        }
    }
}