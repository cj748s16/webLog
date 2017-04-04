import { Injectable } from "@angular/core";

declare var alertify: any;

@Injectable()
export class NotificationService {

    private _notifier: any = alertify;

    printSuccessMessage(message: string) {
        this._notifier.success(message);
        //this._notifier.notify(message, "success", [2000]);
    }

    printErrorMessage(message: string) {
        this._notifier.error(message);
    }

    printConfirmationDialog(message: string, okCallback: () => any) {
        this._notifier.confirm(message, e => {
            if (e) {
                okCallback();
            }
        });
    }
}