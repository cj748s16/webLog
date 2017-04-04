import { Component, forwardRef, ViewChild, OnInit } from "@angular/core";

import { Key, IService } from "../utility";
import { UtilityService } from "../services";
import { TabAccessor, TAB_ACCESSOR } from "./tab_accessor";
import { TabContentComponent } from "./tab-content.component";

@Component({
    providers: [
        { provide: TAB_ACCESSOR, useExisting: forwardRef(() => BaseTabComponent), multi: true }
    ]
})
export abstract class BaseTabComponent<T> implements OnInit, TabAccessor {

    @ViewChild(TabContentComponent)
    private _tabContent: TabContentComponent;

    constructor(
        protected _service: IService,
        protected _utilityService: UtilityService) { }

    abstract ngOnInit();

    getTab(): TabContentComponent {
        return this._tabContent;
    }

    abstract writeValue(value: Map<string, Key>);
}