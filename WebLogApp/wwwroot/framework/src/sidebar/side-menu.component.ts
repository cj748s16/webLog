﻿import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { MenuService, MenuItems, MenuItem, EventsService } from "../services";

declare var jQuery: any;

@Component({
    selector: "side-menu",
    template: `
<div class="sidebar" (mouseleave)="_hoverElemTop=_outOfArea" #sidebar>
    <ul id="sidebar-list" class="sidebar-list">
        <side-menu-item *ngFor="let item of _menuItems" [menuItem]="item" (itemHover)="_hoverItem($event)" (toggleSubMenu)="_toggleSubMenu($event)"></side-menu-item>
    </ul>
    <div class="sidebar-hover-elem" [ngStyle]="{top: _hoverElemTop + 'px', height: _hoverElemHeight + 'px'}" [ngClass]="{'show-hover-elem': _showHoverElem}"></div>
</div>
`
})
export class SideMenuComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() sidebarCollapsed: boolean = false;
    @Input() sidebarShouldCollapsed: boolean = false;
    @Input() menuHeight: number;

    @Output() expandMenu = new EventEmitter<MenuItem>();

    @ViewChild("sidebar")
    private _sidebar: ElementRef;
    private $sidebar: any;

    private _menuItems: MenuItems;

    private _menuItemsSub: Subscription;
    private _onRouteChanged: Subscription;

    private _showHoverElem: boolean;
    private _hoverElemHeight: number;
    private _hoverElemTop: number;
    private _outOfArea: number = -200;

    constructor(
        private _router: Router,
        private _service: MenuService,
        private _eventsService: EventsService) { }

    updateMenu(newMenuItems: MenuItems) {
        this._menuItems = newMenuItems;
        this._selectMenuAndNotify();
    }

    private _selectMenuAndNotify() {
        if (this._menuItems) {
            this._menuItems = this._service.selectMenuItem(this._menuItems);
            this._eventsService.broadcast("menu.activeLink", this._service.getCurrentItem());
            if (this.sidebarShouldCollapsed && !this.sidebarCollapsed) {
                this._eventsService.broadcast("menu.isCollapsed", true);
            }
        }
    }

    ngOnInit() {
        this._onRouteChanged = this._router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this._menuItems) {
                    this._selectMenuAndNotify();
                } else {
                    // on page load we have to wait as event is fired before menu elements are prepared
                    setTimeout(() => this._selectMenuAndNotify());
                }
            }
        });
        this._menuItemsSub = this._service.subscribe(this.updateMenu.bind(this));
    }

    ngAfterViewInit() {
        this.$sidebar = jQuery(this._sidebar.nativeElement);
    }

    ngOnDestroy() {
        this._onRouteChanged.unsubscribe();
        this._menuItemsSub.unsubscribe();
    }

    private _sidebarTop: number;
    private get sidebarTop(): number {
        if (this._sidebarTop == null) {
            this._sidebarTop = this.$sidebar.offset().top;
        }
        return this._sidebarTop;
    }

    private _hoverItem($event) {
        this._showHoverElem = true;
        this._hoverElemHeight = $event.currentTarget.clientHeight;
        this._hoverElemTop = $event.currentTarget.getBoundingClientRect().top - this.sidebarTop;
    }

    private _toggleSubMenu($event): boolean {
        let submenu = jQuery($event.currentTarget).next();

        if (this.sidebarCollapsed) {
            this.expandMenu.emit(null);
            if (!$event.item.expanded) {
                $event.item.expanded = true;
            }
        } else {
            $event.item.expanded = !$event.item.expanded;
            submenu.slideToggle();
        }

        return false;
    }
}