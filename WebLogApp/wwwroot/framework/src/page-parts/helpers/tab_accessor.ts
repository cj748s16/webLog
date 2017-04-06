import { InjectionToken } from "@angular/core";
import { TabContentComponent } from "../tab-contents";
import { Key } from "../../utility";

export interface TabAccessor {
    getTab(): TabContentComponent;

    writeValue(value: Map<string, (Key | Map<string, Key>)>);
    startSizeCheck();
    stopSizeCheck();
}

export declare const TAB_ACCESSOR: InjectionToken<TabAccessor>;