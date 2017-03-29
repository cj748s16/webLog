import { InjectionToken } from "@angular/core";
import { TabContentComponent } from "./tab-content.component";
import { Key } from "../utility";

export interface TabAccessor {
    getTab(): TabContentComponent;

    writeValue(value: Map<string, (Key | Map<string, Key>)>);
}

export declare const TAB_ACCESSOR: InjectionToken<TabAccessor>;