import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

const noop = () => { };

@Component({
    selector: "tab",
    template: ""
})
export class TabComponent {

    @Input() routerLink: RouterLink;
    @Input() title: string;

    private _active: boolean;

    @Input()
    set active(value: boolean) {
        if (this._active != value) {
            this._active = value;
            this.onActivatedCallback();
        }
    }

    get active(): boolean {
        return this._active;
    }

    private onActivatedCallback: () => void = noop;

    registerOnActivate(fn: any) {
        this.onActivatedCallback = fn;
    }

    unregisterOnActivate() {
        this.onActivatedCallback = noop;
    }
}