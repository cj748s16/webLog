import { ViewChild, Input, AfterViewInit } from "@angular/core";

import { Key, IService } from "../utility";
import { UtilityService } from "../services";
import { BaseTabComponent } from "./base-tab.component";

export class ListTabComponent<T> extends BaseTabComponent<T> implements AfterViewInit {

    protected list: Array<T>;
    protected selectedKey: Key;
    public id: string;

    constructor(
        service: IService,
        utilityService: UtilityService,
        private _editUrl: string,
        protected idField: string = "Id") {
        super(service, utilityService);
    }

    ngOnInit() {
        this.getList();
    }

    ngAfterViewInit() {
        if (!this.id) {
            this.id = this.getTab().id;
        }
    }

    getList() {
        this._service.get()
            .subscribe((data: any) => {
                this.list = data;
            },
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