import { Injectable } from "@angular/core";
import { Router, Routes, Route } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class MenuService {

    private _menuItems = new BehaviorSubject<MenuItems>([]);
    private _currentMenuItem: MenuItem = new MenuItem();
    public getCurrentItem(): MenuItem {
        return this._currentMenuItem;
    }

    constructor(
        private _router: Router,
        private _translateService: TranslateService) { }

    public updateMenuByRoutes(routes: Routes) {
        let convertedRoutes = this._convertRoutesToMenus(_.cloneDeep(routes));
        this._menuItems.next(convertedRoutes);
    }

    public subscribe(observerOrNext?: ((value: MenuItems) => void), error?: (error: any) => void, complete?: () => void): Subscription {
        return this._menuItems.subscribe(observerOrNext, error, complete);
    }

    private _convertRoutesToMenus(routes: Routes): any[] {
        const items = this._convertRoutesToItems(routes);
        return this._skipEmpty(items);
    }

    private _skipEmpty(items: any[]): any[] {
        let menu = [];
        items.forEach(item => {
            let menuItem;
            if (item.skip) {
                if (item.children && item.children.length > 0) {
                    menuItem = item.children;
                }
            } else {
                menuItem = item;
            }

            if (menuItem) {
                menu.push(menuItem);
            }
        });
        return [].concat.apply([], menu);
    }

    private _convertRoutesToItems(routes: Routes, parent?: MenuItem): any[] {
        const items = [];
        routes.forEach(route => {
            items.push(this._convertRouteToItem(route, parent));
        });
        return items;
    }

    private _convertRouteToItem(route: Route, parent?: MenuItem): any {
        let item = new MenuItem();
        if (route.data && (<any>route.data).menu) {
            // this is a menu object
            item = new MenuItem((<any>route.data).menu);
            item.route = route;
            delete (<any>item.route.data).menu;
        } else {
            item.route = route;
            item.skip = true;
        }

        // we have to collect all paths to correctly build the url then
        if (Array.isArray(item.route.path)) {
            item.paths = item.route.path;
        } else {
            item.paths = parent && parent.paths ? parent.paths.slice(0) : ['/'];
            if (!!item.route.path) {
                item.paths.push(<string>prepareUrlSegments(item.route.path));
            }
        }

        if (route.children && route.children.length > 0) {
            item.children = this._convertRoutesToItems(route.children, item);
        }

        let prepared = this._prepareItem(item);

        // if current item is selected or expanded - then parent is expanded too
        if ((prepared.selected || prepared.expanded) && parent) {
            parent.expanded = true;
        }

        return prepared
    }

    private _prepareItem(object: MenuItem): MenuItem {
        if (!object.skip) {
            object.target = object.target || "";
            object.pathMatch = object.pathMatch || "full";
            return this._selectItem(object);
        }

        return object;
    }

    get currentLangId(): string {
        return this._translateService.currentLang;
    }

    private _selectItem(object: MenuItem): MenuItem {
        //const paths = !Array.isArray(object.paths) ? [object.paths] : object.paths;
        //object.selected = this._router.isActive(this._router.createUrlTree(paths), object.pathMatch === "full");
        const path = `/${this.currentLangId}${object.path}`;
        object.selected = this._router.isActive(path, object.pathMatch === "full");
        return object;
    }

    public selectMenuItem(menuItems: MenuItems): MenuItems {
        let items: MenuItems = [];
        menuItems.forEach(item => {
            this._selectItem(item);

            if (item.selected) {
                this._currentMenuItem = item;
            }

            if (item.children && item.children.length > 0) {
                item.children = this.selectMenuItem(item.children);
                item.expanded = item.expanded || item.children.some(c => c.expanded || c.selected);
            }
            items.push(item);
        });
        return items;
    }
}

export class MenuItem {
    route: Route;
    skip: boolean;
    children: MenuItems;
    target: string;
    pathMatch: string;
    hidden: boolean;
    selected: boolean;
    expanded: boolean;
    paths: Array<string>;
    url: string;
    order: number;
    icon: string;
    title: string;
    slideRight: boolean;

    constructor({route, skip, children, target, pathMatch, hidden, selected, expanded, paths, path, url, order, icon, title, slideRight}: {
        route?: Route,
        skip?: boolean,
        children?: MenuItems,
        target?: string,
        pathMatch?: string,
        hidden?: boolean,
        selected?: boolean,
        expanded?: boolean,
        paths?: Array<string>,
        path?: string,
        url?: string,
        order?: number,
        icon?: string,
        title?: string,
        slideRight?: boolean
    } = {}) {
        this.route = route;
        this.skip = skip;
        this.children = children;
        this.target = target;
        this.pathMatch = pathMatch;
        this.hidden = hidden || false;
        this.selected = selected || false;
        this.expanded = expanded || false;
        this.paths = <Array<string>>prepareUrlSegments((paths || []));
        this.path = path;
        this.url = url;
        this.order = order || 0;
        this.icon = icon;
        this.title = title;
        this.slideRight = slideRight;
    }

    get path(): string {
        let p = this.paths.join("/");
        p = p.replace("//", "/");
        return p;
    }

    set path(v: string) {
        if (v) {
            let p = v.split("/");
            p = <Array<string>>prepareUrlSegments(p.filter(s => s));
            p.unshift("/");
            this.paths = p;
        }
    }
}

export declare type MenuItems = Array<MenuItem>;

function prepareUrlSegments(url: string | Array<string>): string | Array<string> {
    if (Array.isArray(url)) {
        return url.map(s => s.replace("/", ""));
    } else {
        return url.split("/").filter(s => s).join("/");
    }
}