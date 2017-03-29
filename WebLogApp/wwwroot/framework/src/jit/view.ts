//import { Component, Injectable, ViewChild, ComponentRef, ViewContainerRef, AfterViewInit, OnChanges, OnDestroy, OnInit, SimpleChange, ComponentFactory, ReflectiveKey, Input } from "@angular/core";

//import { IDynamicComponent, DynamicTypeBuilder } from "./type_builder";
//import { IDynamicTemplateBuilder, DynamicTemplateBuilder } from "./template_builder";

//@Injectable()
//export abstract class DynamicViewBase<T extends IDynamicTemplateBuilder> implements AfterViewInit, OnChanges, OnDestroy {

//    @ViewChild("dynamicContentPlaceHolder", { read: ViewContainerRef })
//    private _dynamicContentTarget: ViewContainerRef;

//    private _componentRef: ComponentRef<IDynamicComponent>;

//    private _wasViewInitialized = false;
//    private _refreshingContent = false;

//    @Input() entity: { [key: string]: any };

//    constructor(
//        private _typeBuilder: DynamicTypeBuilder,
//        private _templateBuilder: T) { }

//    private _refreshContent() {
//        if (this._refreshingContent) {
//            return;
//        }
//        this._refreshingContent = true;

//        if (this._componentRef) {
//            this._componentRef.destroy();
//        }

//        let template;
//        let fnList;
//        [template, fnList] = this._templateBuilder.prepareTemplate(this.entity);
//        let componentMetadata = { template: template };

//        this._typeBuilder
//            .createComponentFactory(componentMetadata, fnList)
//            .then((factory: ComponentFactory<IDynamicComponent>) => {
//                this._componentRef = this._dynamicContentTarget.createComponent(factory);

//                const component = this._componentRef.instance;

//                component.entity = this.entity;

//                this._refreshingContent = false;
//            });
//    }

//    ngAfterViewInit() {
//        this._wasViewInitialized = true;
//        this._refreshContent();
//    }

//    ngOnChanges(changes: { [key: string]: SimpleChange }) {
//        if (this._wasViewInitialized) {
//            return;
//        }
//        this._refreshContent();
//    }

//    ngOnDestroy() {
//        if (this._componentRef) {
//            this._componentRef.destroy();
//            this._componentRef = null;
//        }
//    }
//}

//@Component({
//    selector: "dynamic-detail",
//    template: `
//<div #dynamicContentPlaceHolder></div>
//<hr/>
//entity: <pre>{{entity | json}}</pre>
//`
//})
//export class DynamicView extends DynamicViewBase<DynamicTemplateBuilder> {

//    constructor(typeBuilder: DynamicTypeBuilder, templateBuilder: DynamicTemplateBuilder) {
//        super(typeBuilder, templateBuilder);
//    }
//}