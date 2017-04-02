import { NgModule } from "@angular/core";

import { JitModule } from "./jit/jit";

import { PagePartsModule } from "./page-parts/page-parts.module";

//export { Control } from "./controls";

@NgModule({
    imports: [
        PagePartsModule,
        JitModule.forRoot()
    ],
    declarations: [
    ],
    exports: [
        PagePartsModule
    ]
})
export class FrameworkModule { }

export { Key, compareKey, convertDateTime, isMapStringKey, OperationResult, IService } from "./utility";
export { TabsComponent } from "./tabs";
export { PageComponent, TabContentComponent, TabAccessor, TAB_ACCESSOR } from "./page-parts";
export { InlineEdit } from "./page-parts/inline-edit.component";
export { NotificationService } from "./notification.service";
export { UtilityService } from "./utility.service";