import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { NotificationService, UtilityService as fwUtilityService } from "@framework";

@Injectable()
export class UtilityService extends fwUtilityService {

    constructor(
        router: Router,
        notificationService: NotificationService,
        translateService: TranslateService) {
        super(router, notificationService, translateService, "/:lang/system/login");
    }
}