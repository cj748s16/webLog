import { ViewChild, ViewChildren, ElementRef, Input, AfterViewInit, QueryList, OnDestroy } from "@angular/core";

import { Key, IService } from "../utility";
import { UtilityService } from "../services";
import { BaseTabComponent } from "./base-tab.component";
import { GridControl } from "../controls";

declare var jQuery: any;
const $ = jQuery;

export class ListTabComponent<T> extends BaseTabComponent<T> implements AfterViewInit, OnDestroy {

    protected list: Array<T>;
    protected selectedKey: Key;
    public id: string;

    private _sizeCheckInterval: any;
    private $el: any;

    @ViewChildren(GridControl)
    private _grids: QueryList<GridControl>;

    constructor(
        service: IService,
        utilityService: UtilityService,
        private _editUrl: string,
        private _el: ElementRef,
        protected idField: string = "Id") {
        super(service, utilityService);
        this.$el = $(this._el.nativeElement);
    }

    ngOnInit() {
        this.getList();
    }

    Height: number;

    ngAfterViewInit() {
        const tab = this.getTab();
        if (!this.id) {
            this.id = tab.id;
        }

        this._sizeCheckInterval = setInterval(() => {
            let h = this.$el.height();
            if (h != this.Height) {
                this.Height = h;
                tab.setHeight();
            }
        }, 100);
    }

    ngOnDestroy() {
        if (this._sizeCheckInterval) {
            clearInterval(this._sizeCheckInterval);
            this._sizeCheckInterval = null;
        }
    }

    getList() {
        this._assignService.get()
            .subscribe((data: any) => this.list = data,
            error => this._utilityService.handleError.bind(this._utilityService));
    }

    new() {
        this._utilityService.navigate(this._editUrl);
    }

    modify() {
        if (this.selectedKey) {
            let id = this.idField in this.selectedKey ? this.selectedKey[this.idField] : null;
            this._utilityService.navigate(`${this._editUrl}${id}`);
        }
    }

    writeValue(value: Map<string, Key>) {
        if (value.has(this.id)) {
            this.selectedKey = value.get(this.id);
        }
    }
}