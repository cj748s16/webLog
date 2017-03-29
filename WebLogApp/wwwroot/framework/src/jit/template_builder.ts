import { Injectable } from "@angular/core";

export interface IDynamicTemplateBuilder {
    prepareTemplate(entity: { [key: string]: any }): [string, Map<string, Function>];
}

@Injectable()
export class DynamicTemplateBuilder implements IDynamicTemplateBuilder {

    prepareTemplate(entity: any): [string, Map<string, Function>] {
        const properties = Object.keys(entity);
        let template = "<div>";
        let div = "div"

        properties.forEach(propName => {
            template += `<${div}>${propName}: <input type="text" [(ngModel)]="entity.${propName}" /></${div}>`;
        });

        template += "</div>";

        return [template, null];
    }
}