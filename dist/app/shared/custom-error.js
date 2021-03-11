"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../../infra/environment");
class CustomError {
    constructor(message, name) {
        this.name = name || 'Execution Error';
        if (Array.isArray(message))
            this.message = message;
        else if (typeof message === 'string') {
            this.message = [message];
        }
        else {
            this.message = JSON.parse(message);
        }
        this.message = Array.isArray(message) ? message : [message];
        this.stack = environment_1.environment.showStack === "true" ? (new Error()).stack : null;
        this.type = 'Custom';
    }
}
exports.default = CustomError;
