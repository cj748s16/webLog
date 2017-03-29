import { Component, Input } from "@angular/core";

@Component({
    selector: "grid-column",
    template: ""
})
export class GridColumn {

    @Input() width: number;
    @Input() field: string;
    @Input() caption: string;
    @Input() key: boolean;
    @Input() hidden: boolean;
    @Input() format: string;
    //@Input() fn: Function;
}