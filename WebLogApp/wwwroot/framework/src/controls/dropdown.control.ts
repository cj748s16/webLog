import { Component, forwardRef, Input, ContentChildren, QueryList, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";

import { Control } from "./control";
import { GridControl } from "./grid/grid.control";
import { GridColumn } from "./grid/grid-column";

import * as Utility from "../utility";

declare var jQuery: any;
const $ = jQuery;

@Component({
    selector: "column",
    template: ""
})
export class DropdownColumn {

    @Input() width: number;
    @Input() field: string;
    @Input() key: boolean;
    @Input() hidden: boolean;
    @Input() lookup: boolean;
    @Input() format: string;
}

@Component({
    selector: "dropdown",
    template: `
<div class="form-group">
    <input type="hidden" autocomplete="off" [formControl]="control" [(ngModel)]="value" />
    <div class="input-group">
        <div class="ctrl-container">
            <input type="text" class="form-control input-lg foreControl" autocomplete="off" [placeholder]="placeholder | translate" (blur)="onBlur()" #foreControl />
            <input type="text" class="form-control input-lg backControl" autocomplete="off" #backControl tabindex="-1" />
        </div>
        <div class="input-group-btn">
            <button type="button" class="btn btn-default dropdown-toggle" (click)="_toggleDropDown()"><span class="caret"></span></button>
        </div>
        <div class="gridContainer modal-content" #gridContainer>
            <grid [list]="list" heading="false" autoselect="false"></grid>
        </div>
    </div>
    <div *ngFor="let msg of _errorMsg" class="alert alert-danger">{{msg}}</div>
</div>
`,
    styles: [`
.foreControl {
    z-index: 1;
    background: none !important;
    background-image: none !important;
    position: relative;
}
.backControl {
    z-index: 0;
    background-color: #fff;
    color: #c0c0c0;
    position: absolute;
    top: 0;
}
.ctrl-container {
    position: relative;
}
.gridContainer {
    position: absolute;
    height: 200px;
    z-index: 2050;
    display: none;
}
.gridContainer.visible {
    display: block;
}
`],
    providers: [
        { provide: Control, useExisting: forwardRef(() => DropdownControl), multi: true }
    ]
})
export class DropdownControl extends Control implements AfterViewInit, OnChanges, OnDestroy {

    @ContentChildren(DropdownColumn) columns: QueryList<DropdownColumn>;

    @Input() list: Array<any>;
    @Input() minRows: number;
    @Input() maxRows: number;

    @ViewChild("foreControl")
    private _foreControl: ElementRef;
    private $foreControl: any;

    @ViewChild("backControl")
    private _backControl: ElementRef;
    private $backControl: any;

    @ViewChild("gridContainer")
    private _gridContainer: ElementRef;
    private $gridContainer: any;

    //@ViewChild("gridContainerToggler")
    //private _gridContainerToggler: ElementRef;
    //private $gridContainerToggler: any;

    @ViewChild(GridControl)
    private _grid: GridControl;

    ngAfterViewInit() {
        this.$foreControl = $(this._foreControl.nativeElement);
        this.$foreControl.on("keydown", (e: KeyboardEvent) => this._controlKeyDown(e));
        this.$foreControl.on("keyup", (e: KeyboardEvent) => this._controlKeyUp(e));

        this.$backControl = $(this._backControl.nativeElement);

        this.$gridContainer = $(this._gridContainer.nativeElement);
        this.$gridContainer.appendTo("body");

        //this.$gridContainerToggler = $(this._gridContainerToggler.nativeElement);

        this._grid.columns = this._prepareGridColumns();
        this._grid.list = this.list;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && "columns" in changes) {
            this._grid.columns = this._prepareGridColumns();
        }
        if (changes && "list" in changes) {
            this._grid.list = this.list;
        }
    }

    private _prepareGridColumns(): QueryList<GridColumn> {
        //let gridColumns: Array<GridColumn> = [];

        let gridColumns: Array<GridColumn> = this.columns.map(c => {
            let gc = new GridColumn();
            gc.field = c.field;
            gc.format = c.format;
            gc.hidden = c.hidden;
            gc.key = c.key;
            gc.width = c.width;
            return gc;
        });

        var result = new QueryList<GridColumn>();
        result.reset(gridColumns);

        return result;
    }

    protected _setValue(v: any) {
        this._findByValue(v);
        super._setValue(v);
    }

    writeValue(v: any) {
        this._findByValue(v);
        super.writeValue(v);
    }

    private _findByValue(v: any) {
        if (this.$foreControl && this.$backControl) {
            if (v && this.list) {
                const keyField = this._keyField;
                const result = this.list.find((l) => keyField && l[keyField.field] == v);
                const lookupField = this._lookupField;
                this.$foreControl.val(result && lookupField ? result[lookupField.field] : "[Error]");
                this.$backControl.val("");
            } else {
                this.$foreControl.val("");
                this.$backControl.val("");
            }
            if (v != null) {
                this.control.markAsTouched();
            }
            this.control.setValue(v, { onlySelf: false, emitEvent: false, emitModelToViewChange: false, emitViewToModelChange: false });
        }
    }

    private get _lookupField(): DropdownColumn {
        return this.columns.find(f => f.lookup);
    }

    private get _keyField(): DropdownColumn {
        return this.columns.find(f => f.key);
    }

    private _setValueByResult(v: any) {
        if (v) {
            const keyField = this._keyField;
            this._setValue(keyField ? v[keyField.field] : null);
        } else {
            this._setValue(null);
        }
    }

    private _possibleResults: Array<any>;
    private _lookupValue(v: any) {
        if (this.value != v) {
            let s: string = v;
            if (s && s.length > 0 && this.list) {
                let arr: Array<any>;
                const lookupField = this._lookupField;
                if (lookupField) {
                    arr = this.list.filter(l => {
                        let val: string = null;
                        if (lookupField.field in l && typeof l[lookupField.field] === "string") {
                            val = l[lookupField.field];
                        }
                        return val && val.toLowerCase().startsWith(s.toLowerCase());
                    });
                }
                this._possibleResults = arr;
                if (arr && arr.length > 0) {
                    const rem = (<string>arr[0][lookupField.field]).substring(s.length);
                    if (rem) {
                        s += rem;
                    } else {
                        s = "";
                    }
                }
                if (s.length == 0) {
                    this._setValueByResult(this._possibleResults[0]);
                }
            }
            if (s && s.length) {
                this.$backControl.val(s);
            } else {
                this._setValueByResult(null);
            }
        }
    }

    private _controlKeyDown(e: KeyboardEvent) {
        const keyCode = e.charCode || e.keyCode;
        if (keyCode == 0x0d) {
            // 0x0d (13): enter
            const lookupField = this._lookupField;
            const origValue = this.value;
            if (lookupField && this._possibleResults && this._possibleResults.length > 0) {
                this._setValueByResult(this._possibleResults[0]);
                //this.$foreControl.val(this._possibleResults[0][lookupField.field]);
                //this.$backControl.val("");
            }
            if (origValue != this.value) {
                e.preventDefault();
                return false;
            }
        }
    }

    private _controlKeyUp(e: KeyboardEvent) {
        const keyCode = e.charCode || e.keyCode;
        if (keyCode != 0x0d && (keyCode == 0x08 || keyCode == 0x2e || keyCode > 0x2e) && !e.ctrlKey) {
            // 0x0d (13): enter, 0x08 (8): backspace, 0x2e (46): delete
            this._lookupValue(this.$foreControl.val());
        }
    }

    private get _columnsWidth(): number {
        let columnsWidth = 0;
        this.columns.forEach(c => columnsWidth += +c.width || 0);
        return columnsWidth;
    }

    private get _selectedKey(): Utility.Key {
        const keyField = this._keyField;
        if (keyField) {
            const key: Utility.Key = {};
            key[keyField.field] = this.value;
            return key;
        }
        return null;
    }

    private _toggleDropDown() {
        let droppedDown = this.$gridContainer.hasClass("visible");
        if (!droppedDown) {
            let position = this.$foreControl.offset();
            let topOffset = this.$foreControl.outerHeight(true);
            let width = this.$foreControl.width();

            let scrollSize = Utility.scrollSize();
            this.$gridContainer.css("width", "");
            let gridOuterWidth = this._grid.width;
            let columnsWidth = this._columnsWidth;
            width = Math.min(width, columnsWidth + gridOuterWidth + scrollSize);

            let rowHeight = this._grid.rowHeight;
            let minHeight = rowHeight * +(this.minRows || 5);
            let maxHeight = rowHeight * +(this.maxRows || 15);
            let curHeight = this.list ? rowHeight * this.list.length : 0;
            let height = Math.max(minHeight, Math.min(maxHeight, curHeight));

            this.$gridContainer.css({ "top": position.top + topOffset, "left": position.left, "width": width, "height": height });
            this.$gridContainer.addClass("visible");

            this._grid.writeValue(this._selectedKey);
            this._grid.registerOnChange(this._gridChanged.bind(this));
        } else {
            this._grid.registerOnChange(null);
            this.$gridContainer.removeClass("visible");
        }
    }

    private _gridChanged(v: any) {
        const keyField = this._keyField;
        if (keyField && v) {
            this._setValue(v[keyField.field]);
        }
        this._toggleDropDown();
    }

    ngOnDestroy() {
        this.$gridContainer.removeClass("visible");
    }
}

/* ** TODO
- global: closeUp
- inline-edit: closeUp
- moving dropdown when controls moved...
- key handling
*/