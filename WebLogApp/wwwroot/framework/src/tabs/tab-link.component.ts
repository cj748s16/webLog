import { Component, Input } from "@angular/core";

import { TabComponent } from "./tab.component";

@Component({
    selector: "[tabLink]",
    template: `
<a [routerLink]="tab.routerLink" [attr.aria-controls]="tab.title" role="tab" [class]="tab.active ? 'active' : ''" (click)="click()">
    {{tab.title}}
</a>
`
})
export class TabLinkComponent {

    @Input()
    tab: TabComponent;

    click() {
        this.tab.active = true;
    }
}