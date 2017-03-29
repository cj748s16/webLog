import { ElementRef } from "@angular/core";

import { GridColumn } from "./grid-column";

import { Key } from "../../utility";

export interface IGridRow {
    el: ElementRef;
    entity: any;
    key: Key;
    click: () => void;
    prepareKey(columns: Array<GridColumn>);
}