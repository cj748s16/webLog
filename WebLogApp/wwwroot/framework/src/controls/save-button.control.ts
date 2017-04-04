import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "saveButton",
    template: `
<div class="form-group">
    <button class="btn btn-raised btn-primary btn-lg btn-block" (click)="_click($event)" [disabled]="disabled">{{'Save' | translate}}</button>
</div>
`
})
export class SaveButtonControl {

    @Output()
    public clicked = new EventEmitter<Event>();

    @Input()
    public disabled: boolean;

    private _click($event: Event) {
        this.clicked.emit($event);
    }
}