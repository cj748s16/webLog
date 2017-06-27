import { Component, Input, Output, EventEmitter } from "@angular/core";

import { MenuItem } from "../services";

declare var jQuery: any;
const $ = jQuery;

@Component({
    selector: "side-menu-item",
    template: `
<li *ngIf="!menuItem.hidden" [title]="menuItem.title | translate"
    [ngClass]="{'sidebar-list-item': !child, 'sidebar-sublist-item': child, 'selected': menuItem.selected && !menuItem.expanded, 'with-sub-menu': menuItem.children, 'sidebar-item-expanded': menuItem.expanded}">

    <a *ngIf="!menuItem.children && !menuItem.url" [routerLink]="[menuItem.path | localize]" class="sidebar-list-link"
        (mouseenter)="_onHoverItem($event, item)">
        <i *ngIf="menuItem.icon" class="{{menuItem.icon}}"></i><span>{{menuItem.title | translate}}</span>
    </a>

    <a *ngIf="!menuItem.children && menuItem.url" [href]="menuItem.url" [target]="menuItem.target" class="sidebar-list-link"
        (mouseenter)="_onHoverItem($event, item)">
        <i *ngIf="menuItem.icon" class="{{menuItem.icon}}"></i><span>{{menuItem.title | translate}}</span>
    </a>

    <a *ngIf="menuItem.children" class="sidebar-list-link"
        (mouseenter)="_onHoverItem($event, item)" (click)="_onToggleSubMenu($event, menuItem)">
        <i *ngIf="menuItem.icon" class="{{menuItem.icon}}"></i><span>{{menuItem.title | translate}}</span>
        <b class="fa fa-angle-down" [ngClass]="{'fa-angle-up': menuItem.expanded}"></b>
    </a>

    <ul *ngIf="menuItem.children" class="sidebar-sublist" [ngClass]="{'slide-right': menuItem.slideRight}">
        <side-menu-item *ngFor="let subItem of menuItem.children" [menuItem]="subItem" [child]="true"
            (itemHover)="_onHoverItem($event)" (toggleSubMenu)="_onToggleSubMenu($event, subItem)"></side-menu-item>
    </ul>
</li>
`
})
export class SideMenuItemComponent {

    @Input() menuItem: MenuItem;
    @Input() child: boolean = false;

    @Output() itemHover = new EventEmitter<any>();
    @Output() toggleSubMenu = new EventEmitter<any>();

    private _onHoverItem($event) {
        this.itemHover.emit($event);
    }

    private _onToggleSubMenu($event, item): boolean {
        $event.item = item;
        this.toggleSubMenu.emit($event);
        return false;
    }
}