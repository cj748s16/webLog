import { Component, Input } from "@angular/core";

import { TabComponent } from "./tab.component";

@Component({
    selector: "[tabLink]",
    template: `
<a [routerLink]="tab.routerLink" [attr.aria-controls]="tab.title" role="tab" (click)="click()">
    {{tab.title | translate}}
</a>
`
})
export class TabLinkComponent {

    @Input()
    tab: TabComponent;

    click() {
        if (!this.tab.disabled) {
            this.tab.active = true;
        }
    }
}