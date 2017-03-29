import { Component, AfterViewInit, ContentChildren, QueryList } from "@angular/core";
import { Router } from "@angular/router";

import { TabComponent } from "./tab.component";

@Component({
    selector: "tabs",
    template: `
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" *ngFor="let tab of tabs" [tab]="tab" [class.active]="tab.active" tabLink></li>
</ul>
`
})
export class TabsComponent implements AfterViewInit {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    constructor(private _router: Router) { }

    ngAfterViewInit() {
        this._subscribeOnActivate();
    }

    private _subscribeOnActivate() {
        this.tabs.forEach(tab => tab.registerOnActivate(this._tabActivated.bind(this, tab)));
        this._activeTab(this._router.url);
    }

    private _unsubscribeOnActivate() {
        this.tabs.forEach(tab => tab.unregisterOnActivate());
    }

    private _tabActivated(tab: TabComponent) {
        if (tab.active) {
            this.tabs.forEach(t => {
                if (t.active && t != tab) {
                    t.active = false;
                }
            });
        }
    }

    private _activeTab(routerLink: string) {
        this.tabs.forEach(tab => {
            if (Array.isArray(tab.routerLink) && (<Array<any>>tab.routerLink)[0] == routerLink) {
                tab.active = true;
            }
        });
    }

    addTabs(tabs: QueryList<TabComponent>) {
        this._unsubscribeOnActivate();
        this.tabs = tabs;
        this._subscribeOnActivate();
    }
}