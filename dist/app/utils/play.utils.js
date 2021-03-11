"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayUtils {
    constructor() {
        this.isLink = (content) => {
            const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
            const regex = new RegExp(expression);
            return (content === null || content === void 0 ? void 0 : content.match(regex)) ? true : false;
        };
    }
}
exports.default = new PlayUtils();
