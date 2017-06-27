export class Login {
    Userid: string;
    Password: string;
    Sid: string;

    constructor(userid?: string, password?: string, sid?: string) {
        this.Userid = userid;
        this.Password = password;
        this.Sid = sid;
    }

    static from(data: Login): Login {
        return new Login(data.Userid, data.Password, data.Sid);
    }
}