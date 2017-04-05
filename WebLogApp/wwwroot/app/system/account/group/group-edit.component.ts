import { Component, ElementRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { EditTabComponent, NotificationService, UtilityService, EventsService } from "@framework";

import { GroupEdit, RoleViewModel } from "./domain";
import { GroupService } from "./group.service";

@Component({
    moduleId: module.id,
    selector: "groupEditModal",
    templateUrl: "group-edit.component.html"
})
export class GroupEditComponent extends EditTabComponent<GroupEdit> {

    private _roleList: Array<RoleViewModel>;

    constructor(
        private _groupService: GroupService,
        utilityService: UtilityService,
        el: ElementRef,
        notificationService: NotificationService,
        eventsService: EventsService) {
        super(_groupService, utilityService, el, notificationService, eventsService);
    }

    ngOnInit() {
        super.ngOnInit();
        this._getRoleList();
    }

    private _getRoleList() {
        this._groupService.getRoleList()
            .subscribe((data: any) => this._roleList = data,
            error => this._utilityService.handleError.bind(this._utilityService));
    }
}