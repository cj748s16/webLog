export { OperationResult } from "../../../core/domain";

export class GroupEdit {

    Id: number;

    constructor(public Groupname: string) {
    }
}

export class GroupViewModel {
    Id: number;
    Groupname: string;
    Adduserid: string;
    Addusername: string;
    Adddate: Date;
    Delstat: number;
}