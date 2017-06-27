import { Component, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "cancelButton",
    template: `
<div class="col-md-12">
    <a class="btn btn-danger pull-right" (click)="_click($event)" data-dismiss="modal" aria-hidden="true">{{'Cancel' | translate}}</a>
</div>
`
})
export class CancelButtonControl {

    // If calling it click, the event runs twice
    @Output() clicked = new EventEmitter<Event>();

    private _click($event: Event) {
        this.clicked.emit($event);
        $event.preventDefault();
        return false;
    }
}