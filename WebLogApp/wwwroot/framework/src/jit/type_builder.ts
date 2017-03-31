import { Injectable, Component, Input, ReflectiveKey, ComponentFactory, Type, NgModule, Compiler, ElementRef, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { JitModule } from "./jit_module";

declare var _: any;

@Injectable()
export class DynamicTypeBuilder<TComp> {

    private _cachedFactories = new Map<string, TComp>();

    constructor(private _compiler: Compiler) { }

    createComponentFactory(
        key: string,
        createComponent: () => Type<TComp>): Promise<ComponentFactory<TComp>> {

        if (this._cachedFactories.has(key)) {
            return new Promise(resolve => resolve(this._cachedFactories.get(key)));
        }

        const type = createComponent();
        const module = this._createComponentModule(type);

        return new Promise(resolve => {
            this._compiler
                .compileModuleAndAllComponentsAsync(module)
                .then(moduleWithFactories => {
                    const factory = _.find(moduleWithFactories.componentFactories, { componentType: type });
                    this._cachedFactories.set(key, factory);
                    resolve(factory);
                });
        });
    }

    private _createComponentModule(componentType: Type<any>): Type<any> {
        @NgModule({
            imports: [CommonModule, FormsModule, TranslateModule, JitModule],
            declarations: [componentType],
            //exports: [componentType]
        })
        class RuntimeComponentModule { }
        return RuntimeComponentModule;
    }
}