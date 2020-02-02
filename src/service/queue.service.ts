import QueueContructModel from '../model/queue-contruct.model';

class QueueService { 
    queue = new Map();

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