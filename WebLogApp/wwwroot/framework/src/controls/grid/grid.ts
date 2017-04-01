import {
    Component, Injectable, Input,
    ContentChildren, QueryList,
    ViewChild, ViewContainerRef, ComponentRef,
    ComponentFactory, Type,
    OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges,
    Renderer, forwardRef, ElementRef, HostListener,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as MD5 from "crypto-js/md5";

import { GridColumn } from "./grid-column";
import { IGridRow } from "./grid-row";

import { Key } from "../../utility";
import * as Utility from "../../utility";

import { IDynamicTemplateBuilder, DynamicTypeBuilder, JitModule } from "../../jit/jit";

declare var jQuery: any;
const $ = jQuery;

const noop = () => { };

@Component({
    selector: "grid",
    template: `
<div class="grid" #grid>
    <div class="content">
        <div #innerContent class="inner-content">
            <div class="heading">
                <div #gridHeadingPlaceHolder></div>
            </div>
            <div #body class="body">
                <div #innerBody class="inner-body">
                    <div #gridRowsPlaceHolder></div>
                </div>
            </div>
        </div>
        <div #vScroller class="v-scroller">
            <div #innerVScroller ></div>
        </div>
    </div>
</div>
`,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GridControl), multi: true }
    ]
})
export class GridControl implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {

    @Input() list: Array<any>;

    @ContentChildren(GridColumn) columns: QueryList<GridColumn>;

    @ViewChild("gridRowsPlaceHolder", { read: ViewContainerRef })
    private _gridRowsTarget: ViewContainerRef;

    @ViewChild("gridHeadingPlaceHolder", { read: ViewContainerRef })
    private _gridHeadingTarget: ViewContainerRef;

    @ViewChild("grid")
    private _grid: ElementRef;
    private $grid: any;

    @ViewChild("innerContent")
    private _innerContent: ElementRef;

    @ViewChild("body")
    private _body: ElementRef;
    private $body: any;

    @ViewChild("innerBody")
    private _innerBody: ElementRef;

    @ViewChild("vScroller")
    private _vScroller: ElementRef;
    private $vScroller: any;

    @ViewChild("innerVScroller")
    private _innerVScroller: ElementRef;

    private _componentRef: ComponentRef<IGridRow>[];
    private _headingComponentRef: ComponentRef<IGridRow>;

    private _wasViewInitialized = false;
    private _refreshingContent = false;
    private _refreshContentDone: Promise<any>;
    private _refreshContentResolve: () => void;

    private _selectedComp: IGridRow;
    private _rowHeight: number;
    private _topRowIndex: number = 0;

    @Input()
    height: number;

    @Input()
    id: string;

    constructor(
        private _typeBuilder: DynamicTypeBuilder<IGridRow>,
        private _renderer: Renderer) {
        this.id = this.id || Utility.createId(this.constructor.name);
    }

    ngOnInit() {
        this._refreshContentDone = new Promise<any>((resolve) => this._refreshContentResolve = resolve);
    }

    ngAfterViewInit() {
        if (this.list) {
            this._wasViewInitialized = true;
            this._refreshContent();
        }

        this.$grid = $(this._grid.nativeElement);

        this.$vScroller = $(this._vScroller.nativeElement);
        this.$body = $(this._body.nativeElement);

        this._renderer.setElementStyle(this._innerContent.nativeElement, "margin-right", `${Utility.scrollSize()}px`);
        this._renderer.setElementStyle(this._vScroller.nativeElement, "width", `${Utility.scrollSize()}px`);
        this._renderer.listen(this._vScroller.nativeElement, "scroll", this._vScrollHandler.bind(this));

        this._refreshContent();
    }

    private _refreshContent() {
        if (!this.columns) {
            return;
        }

        if (this._refreshingContent) {
            return;
        }
        this._refreshingContent = true;

        let selectedKey: Key;
        if (this._selectedComp) {
            selectedKey = this._getSelectedKey();
        }

        if (this._componentRef) {
            this._componentRef.forEach(cr => cr.destroy());
        }
        if (this._headingComponentRef) {
            this._headingComponentRef.destroy();
        }

        this._renderContent(selectedKey).then(() => {
            this._refreshingContent = false;

            if (this._refreshContentResolve) {
                this._refreshContentResolve();
                this._refreshContentResolve = null;
                this._refreshContentDone = null;
            }
        });
    }

    private _renderContent(selectedKey: Key): Promise<any> {
        return new Promise<any>((resolve) => {
            let headingFinished = false;
            let rowsFinished = false;

            let resolver = function () {
                let height = $(this._innerBody.nativeElement).height();
                this._renderer.setElementStyle(this._innerVScroller.nativeElement, "height", `${height}px`);
                this._vScrollHandler();
                if (selectedKey) {
                    this._findBySelectedKey(selectedKey);
                }
                resolve();
            }

            this._renderHeading().then(() => {
                headingFinished = true;
                if (headingFinished && rowsFinished) {
                    resolver.apply(this);
                }
            });

            this._renderRows(selectedKey, this._rowHeight || 0).then((sk) => {
                selectedKey = sk;

                rowsFinished = true;
                if (headingFinished && rowsFinished) {
                    resolver.apply(this);
                }
            });
        })
    }

    private _renderHeading(): Promise<any> {
        return new Promise<any>((resolve) => {
            const headingTemplate = this._createHeadingTemplate();
            const headingKey = MD5(headingTemplate).toString();
            const compMeta = { template: headingTemplate };

            this._typeBuilder
                .createComponentFactory(headingKey, () => { return this._createNewComponent(compMeta, null); })
                .then((factory: ComponentFactory<IGridRow>) => {
                    this._headingComponentRef = this._gridHeadingTarget.createComponent(factory);
                    resolve();
                });
        });
    }

    private _renderRows(selectedKey: Key, rowHeight: number): Promise<Key> {
        return new Promise<Key>((resolve) => {
            let rowTemplate: string;
            //let fnList: Map<string, Function>;
            //[rowTemplate, fnList] = this._createRowTemplate();
            rowTemplate = this._createRowTemplate();
            const rowKey = MD5(rowTemplate).toString();
            const compMeta = { template: rowTemplate };

            this._typeBuilder
                .createComponentFactory(rowKey, () => { return this._createNewComponent(compMeta/*, fnList*/); })
                .then((factory: ComponentFactory<IGridRow>) => {

                    this._componentRef = new Array();
                    if (this.list) {
                        for (let i = 0; i < this.list.length; i++) {
                            const compRef = this._gridRowsTarget.createComponent(factory);
                            this._componentRef.push(compRef);
                            const comp = compRef.instance;
                            comp.entity = this.list[i];
                            comp.prepareKey(this.columns.toArray());
                            comp.click = () => {
                                this._setSelectedRow(comp);
                            }

                            if (!rowHeight) {
                                rowHeight = $(comp.el.nativeElement).height();
                            }
                            if (!selectedKey) {
                                selectedKey = comp.key;
                            }
                        }
                    }

                    resolve(selectedKey);
                });
        });
    }

    private _vScrollHandler() {
        let scrollTop = this.$vScroller.scrollTop();
        this.$body.scrollTop(scrollTop);
    }

    private _createNewComponent(componentMetadata: { [key: string]: any }, fnList: Map<string, Function> = new Map<string, Function>()): Type<IGridRow> {
        @Component(componentMetadata)
        class DynamicGridRowComponent implements IGridRow {
            @Input() entity: any;

            @HostListener("click")
            @Input() click: () => void;

            private _key: Key;

            constructor(public el: ElementRef) { }

            private _fnList = fnList;

            private _callFn(fnName: string, value: any): any {
                if (this._fnList.has(fnName)) {
                    let fn = this._fnList.get(fnName);
                    return fn(value);
                }
                throw new Error(`Function with ${fnName} name not found`);
            }

            public prepareKey(columns: Array<GridColumn>): Key {
                const key: Key = {};
                columns.forEach(col => {
                    if (col.key) {
                        key[col.field] = this.entity[col.field];
                    }
                });
                return this._key = key;
            }

            public get key(): Key {
                return this._key;
            }

            //convertDateTime(value: any, showTime: boolean = false) {
            //    if (typeof value === "string") {
            //        value = Date.parse(value);
            //    }
            //    return Utility.convertDateTime(value, showTime);
            //}
        }
        return DynamicGridRowComponent;
    }

    private _setSelectedRow(comp: IGridRow) {
        if (this._selectedComp) {
            this._renderer.setElementClass(this._selectedComp.el.nativeElement, "selected", false);
        }
        this._selectedComp = comp;
        if (this._selectedComp) {
            this._renderer.setElementClass(this._selectedComp.el.nativeElement, "selected", true);
        }
        this.onChangedCallback(this._getSelectedKey());
    }

    private _getSelectedKey(): Key {
        return this._selectedComp ? this._selectedComp.key : null;
    }

    private _findBySelectedKey(key: Key) {
        if (this._componentRef && this._componentRef.length) {
            for (let i = 0; i < this._componentRef.length; i++) {
                if (Utility.compareKey(this._componentRef[i].instance.key, key)) {
                    this._setSelectedRow(this._componentRef[i].instance);
                    break;
                }
            }
        } else {
            this._setSelectedRow(null);
        }
    }

    private _fnIndex = 0;

    private _createRowTemplate(): string /*, Map<string, Function>]*/ {
        let template = `<div class="row">`;

        //const fnList = new Map<string, Function>();

        this.columns.forEach(col => {
            if (!col.hidden) {
                let field = `entity.${col.field}`;
                //if (col.fn) {
                //    let fnName = `jit_GridRowFn_${this._fnIndex++}`;
                //    fnList.set(fnName, col.fn);
                //    field = `_callFn("${fnName}", ${field})`;
                //}
                if (col.format) {
                    switch (col.format) {
                        case "D":
                            //field = `convertDateTime(${field})`;
                            field += " | date:'shortDate'";
                            break;
                        case "DT":
                            //field = `convertDateTime(${field}, true)`;
                            field += " | date:'short'";
                            break;
                        default:
                            throw new Error(`Unknown column format: ${col.format}`);
                    }
                }
                template += `<div class="cell" style="width: ${col.width}px; max-width: ${col.width}px;">{{${field}}}</div>`;
            }
        });

        template += `</div>`;

        //return [template, fnList];
        return template;
    }

    private _createHeadingTemplate(): string {
        let template = `<div class="row">`;

        this.columns.forEach(col => {
            if (!col.hidden) {
                template += `<div class="cell" style="width: ${col.width}px; max-width: ${col.width}px;"><span>{{'${col.caption}' | translate}}</span></div>`;
            }
        });

        return template;
    }

    ngOnDestroy() {
        if (this._componentRef) {
            this._componentRef.forEach(cr => cr.destroy());
            this._componentRef = null;
        }
        if (this._headingComponentRef) {
            this._headingComponentRef.destroy();
            this._headingComponentRef = null;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this._wasViewInitialized) {
            return;
        }
        if (changes && "list" in changes) {
            this._refreshContent();
        }
    }

    private onTouchedCallback: () => void = noop;
    private onChangedCallback: (_: any) => void = noop;

    writeValue(v: any) {
        if (v) {
            if ((!this._wasViewInitialized || this._refreshingContent) && this._refreshContentDone) {
                this._refreshContentDone.then(() => this._findBySelectedKey(v));
            } else {
                this._findBySelectedKey(v);
            }
        }
    }

    registerOnChange(fn: any) {
        this.onChangedCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    get top(): number {
        return this.$grid.position().top;
    }

    setHeight(height: number, percent: boolean = false) {
        let topCorr = parseFloat(this.$grid.css("margin-top")) + parseFloat(this.$grid.css("border-top")),
            bottomCorr = parseFloat(this.$grid.css("margin-bottom")) + parseFloat(this.$grid.css("border-bottom"));
        if (!percent) {
            this.$grid.css({ "height": `calc(100% - ${height + topCorr + bottomCorr}px)` });
        } else {
            this.$grid.css({ "height": `calc(${height}% - ${topCorr + bottomCorr}px)` });
        }
    }
}