export { OperationResult } from "../../../core/domain";

export class GroupEdit {

    Id: number;

    constructor(public Groupname: string) {
    }
}

export class GroupViewModel {
    Id: number;
    Groupname: string;
    Adduserid: number;
    Addusername: string;
    Adddate: Date;
    Delstat: number;
}