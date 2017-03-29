﻿import { Component, Injectable, ViewChild, ElementRef, ContentChildren, QueryList, Renderer, Input, AfterViewInit } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Subject } from "rxjs/Subject";

import { TabComponent, TabsComponent } from "../tabs";
import { TabContentComponent } from "./tab-content.component";
import { TabAccessor } from "./tab_accessor";
import { Key } from "../utility";

@Component({
    selector: "page",
    template: `
<div class="container" #container>
    <tabs></tabs>
    <div role="tabpanel" class="tab-content tab-pane">
        <div class="panel panel-default">
            <router-outlet (activate)="_onTabActivate($event)" (deactivate)="_onTabDeactivate"></router-outlet>
        <div>
    </div>
</div>
`
})
export class PageComponent implements AfterViewInit {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    @ViewChild("container")
    private _container: ElementRef;

    @ViewChild(TabsComponent)
    private _tabs: TabsComponent;

    @Input()
    class: string;

    private _tabKeys: Map<string, (Key | Map<string, Key>)> = new Map<string, (Key | Map<string, Key>)>();
    //private _tabObjs: Map<string, Subject<Map<string, Key>>> = new Map<string, Subject<Map<string, Key>>>();

    private _activeTabAccessor: TabAccessor;
    private _activeTab: TabContentComponent;

    constructor(private _renderer: Renderer) { }

    ngAfterViewInit() {
        if (this._tabs) {
            this._tabs.addTabs(this.tabs);
        }

        if (this.class) {
            this._renderer.setElementClass(this._container.nativeElement, this.class, true);
        }
    }

    private _onTabActivate(tab: any) {
        if (!isTabAccessor(tab)) {
            throw new Error(`The given router-outlet doesn't implement TabAccessor`);
        }
        if (!tab.getTab().id) {
            throw new Error(`The given tab id isn't defined`);
        }

        this._activeTabAccessor = tab;
        this._activeTab = tab.getTab();
        this._activeTab.registerOnChange(this._tabValueChanged.bind(this));
        //if (!this._tabObjs.has(this._activeTab.id)) {
        //    this._tabObjs.set(this._activeTab.id, new Subject());
        //}
        //this._activeTabAccessor.pushChanges(this._tabObjs.get(this._activeTab.id));
        this._activeTabAccessor.writeValue(this._tabKeys);
    }

    private _tabValueChanged(value: Key) {
        this._tabKeys.set(this._activeTab.id, value);
        //this._tabObjs.get(this._activeTab.id).next(this._tabKeys);
        this._activeTabAccessor.writeValue(this._tabKeys);
    }

    private _onTabDeactivate() {
        this._activeTab.registerOnChange(null);
        this._activeTab = null;
        this._activeTabAccessor = null;
    }
}

function isTabAccessor(obj: any): obj is TabAccessor {
    return !!obj && typeof obj.getTab === "function";
}