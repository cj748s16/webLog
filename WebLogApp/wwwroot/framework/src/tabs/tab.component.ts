import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

const noop = () => { };

@Component({
    selector: "tab",
    template: ""
})
export class TabComponent {

    private _routerLink: RouterLink;
    @Input()
    get routerLink(): RouterLink{
        return !this.disabled ? this._routerLink : null;
    }
    set routerLink(value: RouterLink) {
        if (this._routerLink != value) {
            this._routerLink = value;
        }
    }

    @Input() title: string;
    @Input() disabled: boolean;

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