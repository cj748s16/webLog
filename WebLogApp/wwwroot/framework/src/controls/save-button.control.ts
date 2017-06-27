import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "saveButton",
    template: `
<div class="form-group">
    <button class="btn btn-raised btn-primary btn-lg btn-block" (click)="_click($event)" [disabled]="disabled">{{label | translate}}</button>
</div>
`
})
export class SaveButtonControl {

    // If calling it click, the event runs twice
    @Output() clicked = new EventEmitter<Event>();

    @Input() disabled: boolean;
    @Input() label: string = "Save";

    private _click($event: Event) {
        this.clicked.emit($event);
        $event.preventDefault();
        return false;
    }
}