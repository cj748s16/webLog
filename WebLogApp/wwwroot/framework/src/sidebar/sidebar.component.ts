import { Component, ElementRef, OnInit, AfterViewInit, HostListener, ViewChild } from "@angular/core";

import { EventsService } from "../services";
import { layoutSizes } from "../utility";

declare var jQuery: any;

@Component({
    selector: "sidebar",
    template: `
<div class="sidebar" #sidebar>
    <side-menu [menuHeight]="_menuHeight" [sidebarCollapsed]="_isMenuCollapsed" [sidebarShouldCollapsed]="_isMenuShouldCollapsed" (expandMenu)="menuExpand()"></side-menu>
</div>
`
})
export class SidebarComponent implements OnInit, AfterViewInit {

    //@ViewChild("sidebar")
    //private _sidebar: ElementRef;
    //private $sidebar: any;
    //private $firstChildOfSidebar: any;

    private _menuHeight: number;
    private _isMenuCollapsed: boolean = false;
    private _isMenuShouldCollapsed: boolean = false;

    constructor(
        private _el: ElementRef,
        private _eventsService: EventsService) {
        this._eventsService.subscribe("menu.isCollapsed", (args) => {
            this._isMenuCollapsed = args;
        });
    }

    ngOnInit() {
        if (this._shouldMenuCollapse()) {
            this.menuCollapse();
        }
    }

    ngAfterViewInit() {
        //this.$sidebar = jQuery(this._sidebar.nativeElement);
        //this.$firstChildOfSidebar = jQuery("side-menu-item:first", this.$sidebar);
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

    //private _sidebarTop: number;
    //private get sidebarTop(): number {
    //    if (this._sidebarTop == null) {
    //        this._sidebarTop = this.$firstChildOfSidebar.offset().top;
    //    }
    //    return this._sidebarTop;
    //}

    private _updateSidebarHeight() {
        //console.log(this._el.nativeElement.childNodes[0].clientHeight);
        // TODO: get rid of magic 84 constant
        //this._menuHeight = this._el.nativeElement.childNodes[0].clientHeight - this.sidebarTop;
        this._menuHeight = this._el.nativeElement.childNodes[0].clientHeight - 88;
    }

    private _shouldMenuCollapse(): boolean {
        return this._isMenuShouldCollapsed = window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
    }
}