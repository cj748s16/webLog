import { Component } from "@angular/core";

import { EventsService } from "../services";

@Component({
    selector: "top-bar",
    template: `
<div class="top-bar clearfix" maxHeight="50" (scrollChange)="scrollChanged($event)" [ngClass]="{scrolled: isScrolled}">
    <a [routerLink]="['/' | localize]" class="logo clearfix"><i class="fa fa-home fa-fw"></i>&nbsp;WebLog</a>
    <a (click)="_toggleMenu()" class="collapse-menu-link fa fa-navicon fa-fw"></a>
</div>
`
})
export class TopBarComponent {

    private _isMenuCollapsed: boolean = false;
    private _isScrolled: boolean = false;

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
}