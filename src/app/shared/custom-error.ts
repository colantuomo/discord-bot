import { environment } from '../../infra/environment';

export default class CustomError {
    name: string;
    message: Array<string>;
    stack: string | undefined | null;
    type: string;

    constructor(message: any, name?: string) {
        this.name = name || 'Execution Error';
        if (Array.isArray(message))
            this.message = message;
        else if (typeof message === 'string') {
            this.message = [message];
        } else {
            this.message = JSON.parse(message);
        }
        this.message = Array.isArray(message) ? message : [message];
        this.stack = environment.showStack === "true" ? (new Error()).stack : null;
        this.type = 'Custom';
    }
}
