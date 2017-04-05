import { Component, Input } from "@angular/core";

@Component({
    selector: "error-msg",
    template: `
<div *ngFor="let msg of messages" class="help-block">{{msg}}</div>
`
})
export class ErrorMsgComponent {

    @Input() messages: Array<string>;
}