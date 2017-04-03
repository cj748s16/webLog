﻿import { EventEmitter } from "@angular/core";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";

import { ActivatedRouteComponent } from "./activated-route.component";

export abstract class IEdit< T > {
    cancel: EventEmitter<Event>;
    save: EventEmitter<Event>;
    modal: ModalComponent;
    activatedRoute: ActivatedRouteComponent;
    entity: T;
}