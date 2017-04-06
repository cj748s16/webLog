import { Component } from "@angular/core";

@Component({
    selector: "[pageMaster]",
    template: `
<sidebar></sidebar>
<top-bar></top-bar>
<div class="main">
    <div class="content">
        <ng-content></ng-content>
    </div>
</div>
`
})
export class PageMasterComponent { }