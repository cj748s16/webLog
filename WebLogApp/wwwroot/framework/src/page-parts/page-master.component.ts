import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "[pageMaster]",
    template: `
<sidebar></sidebar>
<top-bar (signOut)="_onSignOut($event)" [loggedIn]="loggedIn"></top-bar>
<div class="main">
    <div class="content">
        <ng-content></ng-content>
    </div>
</div>
`
})
export class PageMasterComponent {

    @Input() loggedIn: boolean;

    @Output() signOut = new EventEmitter<any>();

    private _onSignOut($event): boolean {
        this.signOut.emit($event);
        return false;
    }
}