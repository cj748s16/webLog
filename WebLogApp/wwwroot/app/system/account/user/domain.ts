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

    static from(data: UserEdit) {
        const result = new UserEdit(data.Userid, data.Username);
        result.Id = data.Id;
        result.Password = data.Password;
        result.ConfirmPassword = data.ConfirmPassword;
        return result;
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