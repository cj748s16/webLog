import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import "rxjs/add/operator/map";

@Injectable()
export class DataService {

    private _baseUri: string;

    constructor(private http: Http) { }

    set(baseUri: string) {
        this._baseUri = baseUri;
    }

    get(mapJson: boolean = true) {
        const uri = this._baseUri;
        if (mapJson) {
            return this.http.get(uri)
                .map(response => <any>response.json());
        } else {
            return this.http.get(uri)
                .map(response => (<Response>response));
        }
    }

    post(data?: any, mapJson: boolean = true) {
        if (mapJson) {
            return this.http.post(this._baseUri, data)
                .map(response => <any>response.json());
        } else {
            return this.http.post(this._baseUri, data);
        }
    }

    put(data: any) {
        return this.http.put(this._baseUri, data)
            .map(response => <any>response.json());
    }

    delete() {
        return this.http.delete(this._baseUri)
            .map(response => <any>response.json());
    }
}