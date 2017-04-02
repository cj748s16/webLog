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

    @Output()
    public clicked = new EventEmitter<Event>();

    private _click($event: Event) {
        this.clicked.emit($event);
        $event.preventDefault();
    }
}