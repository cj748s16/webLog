import { Injectable } from "@angular/core";

import { DataService } from "./data.service";
import { UtilityService } from "./utility.service";
import { LanguageViewModel } from "../domain";

@Injectable()
export class LanguageService {

    private static _languageAPI = "api/:lang/system/language/";

    constructor(
        private _dataService: DataService,
        private _utilityService: UtilityService) { }

    get() {
        this._dataService.set(LanguageService._languageAPI);
        return this._dataService.get();
    }
}