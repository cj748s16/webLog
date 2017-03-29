import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Ng2Bs3ModalModule } from "ng2-bs3-modal/ng2-bs3-modal";
import { FrameworkModule } from "@framework";

import { accountRouting } from "./account.routes";

import { AccountComponent } from "./account.component";

import { UserService } from "./user/user.service";
import { UserComponent } from "./user/user.component";
import { UserListComponent } from "./user/user-list.component";
import { UserEditComponent } from "./user/user-edit.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        Ng2Bs3ModalModule,
        FrameworkModule,
        accountRouting
    ],
    declarations: [
        AccountComponent,

        UserComponent,
        UserListComponent,
        UserEditComponent
    ],
    providers: [
        UserService
    ]
})
export class AccountModule { }