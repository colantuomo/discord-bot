import QueueContructModel from '../model/queue-contruct.model';

class QueueService {
    instance: any;
    queue = new Map();

    constructor() {
        if (!instance) {
            this.instance = this;
        }
        return instance;
    }

    get(id: any) {
        return this.queue.get(id);
    }

    set(id: any, queueContruct: QueueContructModel) {
        this.queue.set(id, queueContruct);
    }

    delete(id: any) {
        this.queue.delete(id);
    }

}

const instance = new QueueService();
export = instance;