import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";

import { NotificationService, UtilityService as fwUtilityService } from "@framework";

@Injectable()
export class UtilityService extends fwUtilityService  {

    constructor(
        _router: Router,
        _notificationService: NotificationService) {
        super(_router, _notificationService, "/system/account/login");
    }
}