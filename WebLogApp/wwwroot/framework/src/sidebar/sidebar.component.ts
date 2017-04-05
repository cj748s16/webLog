import { Component, ElementRef, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { EventsService } from "../services";

import { layoutSizes } from "../utility";

@Component({
    selector: "sidebar",
    template: `
<div class="sidebar">
    <side-menu [menuHeight]="_menuHeight" [sidebarCollapsed]="_isMenuCollapsed" (expandMenu)="menuExpand()"></side-menu>
</div>
`
})
export class SidebarComponent implements OnInit, AfterViewInit {

    private _menuHeight: number;
    private _isMenuCollapsed: boolean = false;
    get isMenuCollapsed(): boolean {
        return this._isMenuCollapsed;
    }
    private _isMenuShouldCollapsed: boolean = false;

    constructor(
        private _el: ElementRef,
        private _eventsService: EventsService) {
        this._eventsService.subscribe("menu.isCollapsed", (args) => {
            this._isMenuCollapsed = <boolean>args[0];
        });
    }

    ngOnInit() {
        if (this._shouldMenuCollapse()) {
            this.menuCollapse();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this._updateSidebarHeight());
    }

    @HostListener("window:resize")
    private _onWindowResize() {
        var isMenuShouldCollapsed = this._shouldMenuCollapse();
        if (this._isMenuShouldCollapsed !== isMenuShouldCollapsed) {
            this._menuCollapseStateChange(isMenuShouldCollapsed);
        }
        this._isMenuShouldCollapsed = isMenuShouldCollapsed;
        this._updateSidebarHeight();
    }

    menuExpand() {
        this._menuCollapseStateChange(false);
    }

    menuCollapse() {
        this._menuCollapseStateChange(true);
    }

    private _menuCollapseStateChange(isCollapsed: boolean) {
        this._isMenuCollapsed = isCollapsed;
        this._eventsService.broadcast("menu.isCollapsed", this._isMenuCollapsed);
    }

    private _updateSidebarHeight() {
        // TODO: get rid of magic 84 constant
        this._menuHeight = this._el.nativeElement.childNodes[0].clientHeight - 84;
    }

    private _shouldMenuCollapse(): boolean {
        return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
    }
}