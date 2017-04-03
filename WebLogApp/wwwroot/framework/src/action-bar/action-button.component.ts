import { Component/*, Input*/, ElementRef } from "@angular/core";

//const noop = () => { };

@Component({
    selector: "[actionButton]",
    template: "<ng-content></ng-content>"
})
export class ActionButtonComponent {

    //@Input() title: string;
    //@Input() click: (event) => void = noop;

    constructor(public el: ElementRef) { }
}