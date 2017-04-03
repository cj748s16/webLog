import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "[activatedRoute]",
    template: ""
})
export class ActivatedRouteComponent {

    constructor(
        public route: ActivatedRoute,
        public location: Location) { }
}