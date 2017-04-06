import { Component, forwardRef, ViewChild, OnInit, OnDestroy, ElementRef } from "@angular/core";

import { Key, IService } from "../../utility";
import { UtilityService } from "../../services";
import { TabAccessor, TAB_ACCESSOR } from "../helpers";
import { TabContentComponent } from "../tab-contents";

declare var jQuery: any;
const $ = jQuery;

@Component({
    providers: [
        { provide: TAB_ACCESSOR, useExisting: forwardRef(() => BaseTabComponent), multi: true }
    ]
})
export abstract class BaseTabComponent<T> implements OnInit, OnDestroy, TabAccessor {

    @ViewChild(TabContentComponent)
    private _tabContent: TabContentComponent;

    constructor(
        protected _assignService: IService,
        protected _utilityService: UtilityService,
        protected _el: ElementRef) {
        this.$el = $(this._el.nativeElement);
    }

    abstract ngOnInit();

    ngOnDestroy() {
        this.stopSizeCheck();
    }

    getTab(): TabContentComponent {
        return this._tabContent;
    }

    abstract writeValue(value: Map<string, Key>);

    Height: number;

    private $el: any;
    private _sizeCheckInterval: any;
    startSizeCheck() {
        const tab = this.getTab();
        this._sizeCheckInterval = setInterval(() => {
            let h = this.$el.height();
            if (h != this.Height) {
                this.Height = h;
                tab.setHeight();
            }
        }, 100);
    }

    stopSizeCheck() {
        if (this._sizeCheckInterval) {
            clearInterval(this._sizeCheckInterval);
            this._sizeCheckInterval = null;
        }
    }
}