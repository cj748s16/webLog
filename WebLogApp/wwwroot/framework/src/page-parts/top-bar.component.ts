import { Component, Input, Output, EventEmitter } from "@angular/core";

import { EventsService } from "../services";

@Component({
    selector: "top-bar",
    template: `
<div class="top-bar clearfix" maxHeight="50" (scrollChange)="scrollChanged($event)" [ngClass]="{scrolled: isScrolled}">
    <a [routerLink]="['/' | localize]" class="logo clearfix"><i class="fa fa-home fa-fw"></i>&nbsp;WebLog</a>
    <a (click)="_toggleMenu()" class="collapse-menu-link fa fa-navicon fa-fw"></a>
    <user-profile (signOut)="_onSignOut($event)" [loggedIn]="loggedIn"></user-profile>
</div>
`
})
export class TopBarComponent {

    private _isMenuCollapsed: boolean = false;
    private _isScrolled: boolean = false;

    @Input() loggedIn: boolean;

    @Output() signOut = new EventEmitter<any>();

    constructor(private _eventsService: EventsService) {
        this._eventsService.subscribe("menu.isCollapsed", (args) => {
            this._isMenuCollapsed = args;
        });
    }

    private _toggleMenu() {
        this._isMenuCollapsed = !this._isMenuCollapsed;
        this._eventsService.broadcast("menu.isCollapsed", this._isMenuCollapsed);
    }

    private _isScrolledChanged(isScrolled) {
        this._isScrolled = isScrolled;
    }

    private _onSignOut($event): boolean {
        this.signOut.emit($event);
        return false;
    }
}