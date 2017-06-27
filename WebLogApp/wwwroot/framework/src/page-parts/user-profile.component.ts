import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "user-profile",
    template: `
<div class="user-profile clearfix" *ngIf="loggedIn">
    <div class="dropdown al-user-profile">
        <a aria-expanded="false" class="profile-toggle-link dropdown-toggle fa fa-navicon fa-fw" data-toggle="dropdown" id="user-profile-dd">
            <!-- <img src="assets/img/app/profile/Nasta.png"> -->
        </a>
        <ul aria-labelledby="user-profile-dd" class="dropdown-menu top-dropdown-menu profile-dropdown">
            <li class="dropdown-item">
                <a class="signout" href (click)="_onSignOut($event)"><i class="fa fa-power-off"></i>{{"Sign out" | translate}}</a>
            </li>
        </ul>
    </div>
</div>
`
})
export class UserProfileComponent {

    @Input() loggedIn: boolean;

    @Output() signOut = new EventEmitter<any>();

    private _onSignOut($event): boolean {
        this.signOut.emit($event);
        return false;
    }
}