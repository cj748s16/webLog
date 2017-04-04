import { Component, ViewChild, ViewChildren, ContentChildren, QueryList, AfterViewInit, HostBinding, ElementRef, Input, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { Subject } from "rxjs/Subject";

import { ActionBarComponent, ActionButtonComponent } from "../action-bar";
import { GridControl } from "../controls/grid/grid.control";
import { Key, compareKey } from "../utility";

declare var jQuery: any;
const $ = jQuery;

const noop = () => { };

@Component({
    selector: "[tabContent]",
    template: `
<action-bar></action-bar>
<ng-content></ng-content>
`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TabContentComponent), multi: true }
    ]
})
export class TabContentComponent implements AfterViewInit, ControlValueAccessor {

    @ViewChild(ActionBarComponent)
    private _actionBar: ActionBarComponent;

    @ContentChildren(ActionButtonComponent)
    buttons: QueryList<ActionButtonComponent>;

    @ContentChildren(GridControl)
    grids: QueryList<GridControl>;

    @Input()
    keyGrid: string;

    @Input()
    id: string;

    @HostBinding("class.container")
    @HostBinding("class.tab")
    private _isTab: boolean = false;

    private $el: any;
    private _keyGrid: GridControl;
    private _gridKeys: Map<string, Key> = new Map<string, Key>();

    protected _handleButtons: boolean = true;

    constructor(private _el: ElementRef) {
        this.$el = $(_el.nativeElement);
    }

    ngAfterViewInit() {
        if (this._actionBar && this._handleButtons) {
            this._actionBar.addButtons(this.buttons);
        }

        this._isTab = true;

        let keyGridFound = !this.keyGrid && this.grids.length == 1;
        this.grids.forEach(g => {
            g.registerOnChange(this._gridChanged.bind(this, g))
            keyGridFound = keyGridFound || g.id == this.keyGrid;
            if (keyGridFound && !this._keyGrid) {
                this._keyGrid = g;
            }
        });
        if (!keyGridFound && this.keyGrid) {
            throw Error(`Grid with key ${this.keyGrid} not found`);
        }

        this.setHeight();
    }

    setHeight() {
        if (this.grids && this.grids.length > 0) {
            let minGridTop = 0, totalHeightPercnt = 0;
            this.grids.forEach(g => {
                minGridTop = Math.min(minGridTop || g.top, g.top);
                totalHeightPercnt += +g.height || 0;
            });
            if (this.grids.length == 1) {
                this.grids.first.setHeight(minGridTop);
            } else {
                const totalHeight = this.$el.height();
                const percntReduction = minGridTop / (totalHeight / 100);
                totalHeightPercnt += percntReduction;
                let usedHeight = 0;
                const gridsArray = this.grids.toArray();
                for (let i = 0; i < gridsArray.length - 1; i++) {
                    const g = gridsArray[i];
                    const height = +g.height / (totalHeightPercnt / 100);
                    g.setHeight(height, true);
                    usedHeight += height;
                }
                const g = gridsArray[gridsArray.length - 1];
                g.setHeight(100 - percntReduction - usedHeight, true);
            }
        }
    }

    private _gridChanged(grid: GridControl, value: Key) {
        let oldKey: Key = null;
        if (this._gridKeys.has(grid.id)) {
            oldKey = this._gridKeys.get(grid.id);
        }
        if (!compareKey(value, oldKey)) {
            this._gridKeys.set(grid.id, value);
            if (this._keyGrid && this._keyGrid == grid) {
                this.onChangedCallback(value);
            } else if (!this._keyGrid) {
                this.onChangedCallback(this._gridKeys);
            }
        }
    }

    private onTouchedCallback: () => void = noop;
    private onChangedCallback: (_: (Key | Map<string, Key>)) => void = noop;

    writeValue(v: any) {
        if (this._keyGrid) {
            this._gridKeys.set(this._keyGrid.id, v);
            this._keyGrid.writeValue(v);
        }
    }

    registerOnChange(fn: any) {
        this.onChangedCallback = fn || noop;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn || noop;
    }
}