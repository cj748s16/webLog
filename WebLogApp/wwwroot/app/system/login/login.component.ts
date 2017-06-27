import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { OperationResult, UtilityService, NotificationService } from "@framework";

import { Login } from "./domain";
import { LoginService } from "./login.service";

declare var jQuery: any;
const $ = jQuery;

@Component({
    moduleId: module.id,
    selector: "login",
    templateUrl: "./login.component.html"
})
export class LoginComponent implements AfterViewInit, OnDestroy {

    @ViewChild("authMain")
    private _authMain: ElementRef;
    private $authMain: any;

    private entity: Login;

    constructor(
        private _loginService: LoginService,
        private _location: Location,
        private _utilityService: UtilityService,
        private _notificationService: NotificationService) {
        this.entity = new Login("dev", "a");
        // initialize cryptoService
        //this._loginService.getClientInfo();
    }

    ngAfterViewInit() {
        this.$authMain = $(this._authMain.nativeElement);
        this.$authMain.appendTo("body");
    }

    ngOnDestroy() {
        this.$authMain.detach();
    }

    private _login($event: Event) {
        this._doLogin();
        $event.preventDefault();
        return false;
    }

    private _doLogin() {
        let loginResult: OperationResult = new OperationResult(false, "");
        this._loginService.login(this.entity)
            .subscribe(res => loginResult = OperationResult.fromResponse(res),
            error => this._utilityService.handleError(error),
            () => {
                if (loginResult.Succeeded) {
                    this._location.back();
                } else {
                    this._notificationService.printErrorMessage(loginResult.Message);
                    console.log(`Login error: ${loginResult.Message}`);
                }
            });
    }
}