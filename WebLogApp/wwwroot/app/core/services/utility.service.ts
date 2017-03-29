import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

import { NotificationService } from "./notification.service";

@Injectable()
export class UtilityService {

    constructor(
        private _router: Router,
        private _notificationService: NotificationService) { }

    navigate(path: string, extras?: NavigationExtras) {
        this._router.navigate([path], extras);
    }

    navigateToSignIn(extras?: NavigationExtras) {
        this.navigate("/account/login", extras);
    }

    handleError(error: any) {
        if (error.status == 401 || error.status == 404) {
            this._notificationService.printErrorMessage("Authentication required");
            this.navigateToSignIn();
        } else {
            console.error(`Error: ${error}`);
        }
    }
}