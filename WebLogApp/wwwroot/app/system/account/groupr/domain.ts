export class GroupRights {

    Id: number;
    Allowed: number;
    Forbidden: number;

    constructor(public Key: string) {
    }

    static from(data: GroupRights) {
        const result = new GroupRights(data.Key);
        result.Id = data.Id;
        result.Allowed = data.Allowed;
        result.Forbidden = data.Forbidden;
        return result;
    }
}

export class GroupRightsData {

    constructor(public GroupId: number, public List: Array<GroupRights>) { }
}