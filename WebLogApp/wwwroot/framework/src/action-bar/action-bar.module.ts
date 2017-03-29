import { NgModule } from "@angular/core";

import { ActionBarComponent } from "./action-bar.component";
import { ActionButtonComponent } from "./action-button.component";

@NgModule({
    imports: [],
    declarations: [
        ActionBarComponent,
        ActionButtonComponent
    ],
    exports: [
        ActionBarComponent,
        ActionButtonComponent
    ]
})
export class ActionBarModule { }