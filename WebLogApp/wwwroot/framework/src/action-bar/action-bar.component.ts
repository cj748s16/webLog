import { Component, ContentChildren, QueryList, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

import { ActionButtonComponent } from "./action-button.component";

declare var jQuery: any;
const $ = jQuery;

// <button type="button" class="btn btn-default" *ngFor="let button of buttons" [button]="button" (click)="tab.click">{{tab.title}}</button>


@Component({
    selector: "action-bar",
    template: `
<div class="btn-group" role="group" aria-label="Actions" #container>
</div>
`})
export class ActionBarComponent implements AfterViewInit {

    @ContentChildren(ActionButtonComponent) buttons: QueryList<ActionButtonComponent>;

    @ViewChild("container")
    private _container: ElementRef;

    private $container: any;

    ngAfterViewInit() {
        this.$container = $(this._container.nativeElement);
    }

    addButtons(buttons: QueryList<ActionButtonComponent>) {
        this.buttons = buttons;
        if (this.buttons) {
            this.buttons.forEach(b => this.$container.append(b.el.nativeElement));
        }
    }
}