import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import * as dateFormat from "dateformat";

let _scrollSize: number;

declare var jQuery: any;
const $ = jQuery;

function getScrollSize() {
    var $d1 = $("<div/>")
        .css({ "position": "relative", "width": 100, "height": 100, "top": 100, "left": 100, "overflow": "scroll" })
        .appendTo("body");
    var $d2 = $("<div/>")
        .css({ "width": "100%", "height": "100%" })
        .appendTo($d1);
    _scrollSize = 100 - $d2.width() + 1;
    $d1.detach();
}

export function scrollSize(): number {
    if (!_scrollSize) {
        getScrollSize();
    }
    return _scrollSize;
}

export interface Key extends Object { };

export const Key: { [key: string]: any } = {};

export function compareKey(key1: Key, key2: Key): boolean {
    if (key1 == null && key2 != null) {
        return false;
    }

    if (key1 != null && key2 == null) {
        return false;
    }

    var comp = (k1, k2) => {
        for (let k in k1) {
            if (k1.hasOwnProperty(k) && !k2.hasOwnProperty(k)) {
                return false;
            }
            if (k1[k] != k2[k]) {
                return false;
            }
        }
        return true;
    }

    if (!comp(key1, key2)) {
        return false;
    }

    if (!comp(key2, key1)) {
        return false;
    }

    return true;
}

export function convertDateTime(date: Date, showTime: boolean = false) {
    if (showTime) {
        return dateFormat(date, "mm/dd/yyyy h:MM:ss TT");
    } else {
        return dateFormat(date, "mm/dd/yyyy");
    }
}

export function createId(_class: string): string {
    const s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
    return _class + s4() + s4();
}

export function isMapStringKey(obj: any): obj is Map<string, Key> {
    return !!obj && typeof obj.has === "function";
}

export class OperationResult {

    public CustomData: any;

    constructor(public Succeeded: boolean, public Message: string) { }

    public static fromResponse(res: Response): OperationResult {
        // parse response, and getting fields
        let succeeded = (<any>res).Succeeded;
        let message = (<any>res).Message;

        const result = new OperationResult(!!succeeded, message);
        result.CustomData = (<any>res).CustomData;
        return result;
    }
}

export abstract class IService {

    abstract get(key: any): Observable<any>;
    abstract modify(entity: any): Observable<any>;
    abstract new(entity: any): Observable<any>;
}