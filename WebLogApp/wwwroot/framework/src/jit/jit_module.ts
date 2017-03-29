import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DynamicTypeBuilder } from "./type_builder";
import { DynamicTemplateBuilder } from "./template_builder";
//import { DynamicView } from "./view";

@NgModule({
    imports: [CommonModule, FormsModule],
    //declarations: [DynamicView],
    //exports: [DynamicView]
})
export class JitModule {

    static forRoot() {
        return {
            ngModule: JitModule,
            providers: [
                DynamicTypeBuilder,
                DynamicTemplateBuilder
            ]
        };
    }
}