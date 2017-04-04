import { Component, Input, ElementRef, forwardRef } from "@angular/core";

import { TabContentComponent } from "./tab-content.component";

@Component({
    selector: "[assignTabContent]",
    template: `
<action-bar></action-bar>
<ng-content></ng-content>
`,
    providers: [
        { provide: TabContentComponent, useExisting: forwardRef(() => AssignTabContentComponent), multi: true },
    ]
})
export class AssignTabContentComponent extends TabContentComponent {

    @Input() parentId: string;
    @Input() availableId: string;
    @Input() assignedId: string;

    constructor(el: ElementRef) {
        super(el);
    }
}