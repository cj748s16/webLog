export { OperationResult } from "../../../core/domain";

//export class User {

//    Username: string;
//    RememberMe = false;

//    constructor(public Userid: string, public Password: string) {
//    }
//}

export class UserEdit {

    Id: number;
    Password: string;
    ConfirmPassword: string;

    constructor(public Userid: string, public Username: string) {
    }
}

export class UserViewModel {

    Id: number;
    Userid: string;
    Username: string;
    Passwdexpr: Date;
    Addusrid: number;
    Addusername: string;
    Adddate: Date;
    Delstat: number;
}