import { ViewChild, ViewChildren, ElementRef, Input, AfterViewInit, QueryList } from "@angular/core";

import { Key, IService } from "../../utility";
import { UtilityService } from "../../services";
import { BaseTabComponent } from "./base-tab.component";
import { GridControl } from "../../controls";

declare var jQuery: any;
const $ = jQuery;

export class ListTabComponent<T> extends BaseTabComponent<T> implements AfterViewInit {

    protected list: Array<T>;
    protected selectedKey: Key;
    public id: string;

    @ViewChildren(GridControl)
    private _grids: QueryList<GridControl>;

    constructor(
        service: IService,
        utilityService: UtilityService,
        el: ElementRef,
        private _editUrl: string,
        protected idField: string = "Id") {
        super(service, utilityService, el);
    }

    ngOnInit() {
        this.getList();
    }

    ngAfterViewInit() {
        const tab = this.getTab();
        if (!this.id) {
            this.id = tab.id;
        }
    }

    getList() {
        this._service.get()
            .subscribe((data: any) => this.list = data,
            error => this._utilityService.handleError(error));
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