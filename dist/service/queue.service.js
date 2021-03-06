"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueService {
    constructor() {
        this.queue = new Map();
    }
    static getInstance() {
        if (!QueueService.instance) {
            QueueService.instance = new QueueService();
        }
        return QueueService.instance;
    }
    get(id) {
        return this.queue.get(id);
    }
    set(id, queueContruct) {
        this.queue.set(id, queueContruct);
    }
    delete(id) {
        this.queue.delete(id);
    }
}
exports.default = QueueService;
