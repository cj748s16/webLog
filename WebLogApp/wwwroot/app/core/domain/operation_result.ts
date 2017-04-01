import { Response } from "@angular/http";

export class OperationResult {

    public CustomData: any;

    constructor(public Succeeded: boolean, public Message: string) { }

    public static fromResponse(res: Response): OperationResult {
        // parse response, and getting fields
        let succeeded = (<any>res).Succeeded;
        let message = (<any>res).Message;

        const result = new OperationResult(!!succeeded, message);
        result.CustomData = (<any>res).CustomData;
        return result;
    }
}